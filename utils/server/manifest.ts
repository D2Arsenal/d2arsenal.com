import { getDestinyManifest, getDestinyManifestSlice } from "bungie-api-ts/destiny2";
import { createStorage } from 'unstorage'
import { $fetch } from 'ohmyfetch'
// @ts-ignore
import fsDriver from 'unstorage/drivers/fs'

import { isWeapon, isWeaponFrame, isWeaponMod, isWeaponTrait, isCatalyst, isMasterwork } from '../checks';

import type { HttpClientConfig } from "bungie-api-ts/destiny2";
import type { ManifestData, MinimalManifestData } from "../../types";
import type { PrunedDestinyInventoryItemDefinition } from '../../types/destiny';
import { toPrunedItemDef } from '../transforms';
import { compress, decompress } from "./brotli";

const MANIFEST_CACHE_KEY = 'manifest.json'

const $http = async (config: HttpClientConfig) => $fetch(config.url, {
  method: config.method,
  params: config.params,
  body: config.body
})

const storage = createStorage({
  driver: fsDriver({ base: './server/assets/manifest' })
})


export const loadManifest = async () => {
  const possibleCacheItem = await storage.getItem(MANIFEST_CACHE_KEY) as { data: ManifestData, version: string } | null
  if (possibleCacheItem) {
    return JSON.parse(await decompress(JSON.stringify(possibleCacheItem))) as { data: ManifestData, version: string }
  }
  console.log(`No cache hit for manifest`)

  const { Response: destinyManifest } = await getDestinyManifest($http);
  const version = destinyManifest.version

  const manifestTables = await getDestinyManifestSlice($http, {
    destinyManifest: destinyManifest,
    tableNames: [
      'DestinyInventoryItemDefinition',
      'DestinyItemTierTypeDefinition',
      'DestinySocketTypeDefinition',
      'DestinyStatDefinition',
      'DestinyStatGroupDefinition',
      'DestinyPlugSetDefinition',
      'DestinyDamageTypeDefinition',
      'DestinySandboxPerkDefinition',
      'DestinyPowerCapDefinition',
      'DestinyEnergyTypeDefinition',
      'DestinyCollectibleDefinition',
    ],
    language: 'en',
  });

  const {
    DestinyInventoryItemDefinition: rawItemDefs,
    DestinyItemTierTypeDefinition: itemTiers,
    DestinyStatDefinition: statDefs,
    DestinyStatGroupDefinition: statGroups,
    DestinyPlugSetDefinition: plugSets,
    DestinyDamageTypeDefinition: damageTypes,
    DestinySandboxPerkDefinition: sandboxPerks,
    DestinyPowerCapDefinition: powerCaps,
    DestinyEnergyTypeDefinition: energyTypes,
  } = manifestTables

  const weapons: PrunedDestinyInventoryItemDefinition[] = []
  const frames: PrunedDestinyInventoryItemDefinition[] = []
  const mods: PrunedDestinyInventoryItemDefinition[] = []
  const weaponTraits: PrunedDestinyInventoryItemDefinition[] = []
  const catalysts: PrunedDestinyInventoryItemDefinition[] = []
  const masterworks: PrunedDestinyInventoryItemDefinition[] = []

  const ARR_LOOKUP = [
    { fn: isWeapon, arr: weapons },
    { fn: isWeaponFrame, arr: frames },
    { fn: isWeaponMod, arr: mods },
    { fn: isWeaponTrait, arr: weaponTraits },
    { fn: isCatalyst, arr: catalysts },
    { fn: isMasterwork, arr: masterworks }
  ]

  Object.values(rawItemDefs).forEach((def) => {
    const { arr } = ARR_LOOKUP.find(({ fn }) => fn(def)) ?? {}
    if (!arr) {
      return
    }
    arr.push(toPrunedItemDef(def))
  })


  const data: ManifestData = {
    weapons,
    frames,
    mods,
    weaponTraits,
    catalysts,
    masterworks,
    itemTiers,
    statDefs,
    statGroups,
    plugSets,
    damageTypes,
    sandboxPerks,
    powerCaps,
    seasonCap: 1580,// TODO Ah, power cap for season currentSeasonRewardPowerCap from uhh, profile call. Can hardcode for now
    energyTypes
  }

  const compressed = await compress(JSON.stringify({ data, version }))
  storage.setItem(MANIFEST_CACHE_KEY, compressed)
  return { data, version }
}

export const loadMinimalManifest = async () => {
  const { data, version } = await loadManifest()
  // TODO: remove mods and masterworks after adding to single endpoint
  const minimalManifest: MinimalManifestData = {
    mods: data.mods,
    itemTiers: data.itemTiers,
    statDefs: data.statDefs,
    statGroups: data.statGroups,
    plugSets: data.plugSets,
    damageTypes: data.damageTypes,
    sandboxPerks: data.sandboxPerks,
    powerCaps: data.powerCaps,
    seasonCap: data.seasonCap,
    energyTypes: data.energyTypes
  }
  return { minimalManifest, version }
}