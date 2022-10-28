import { DestinyManifest, getDestinyManifest, getDestinyManifestSlice } from "bungie-api-ts/destiny2";
import { createStorage } from 'unstorage'
import { $fetch } from 'ohmyfetch'
// @ts-ignore
import fsDriver from 'unstorage/drivers/fs'

import { isWeapon, isWeaponFrame, isWeaponMod, isWeaponTrait, isCatalyst, isMasterwork } from '../checks';

import type { HttpClientConfig } from "bungie-api-ts/destiny2";
import type { ManifestData, MinimalManifestData } from "../../types";
import type { PrunedDestinyInventoryItemDefinition } from '../../types/destiny';


const FILE_NAME = {
  PREFIX: 'manifest-',
  SUFFIX: '.json'
}

const getCacheKeyForVersion = (version: string) => FILE_NAME.PREFIX + version + FILE_NAME.SUFFIX

const $http = async (config: HttpClientConfig) => $fetch(config.url, {
  method: config.method,
  params: config.params,
  body: config.body
})

const storage = createStorage({
  driver: fsDriver({ base: './server/assets/manifest' })
})


export const loadManifest = async (version?: string) => {
  console.log('Loading manifest for given version:', { version })
  let destinyManifest: DestinyManifest | null = null;

  if (!version) {
    console.log('Fetching new manifest')
    const { Response } = await getDestinyManifest($http);
    destinyManifest = Response;
    version = destinyManifest.version
  }

  const cacheKey = getCacheKeyForVersion(version)
  const possibleCacheItem = await storage.getItem(cacheKey) as ManifestData | null
  if (possibleCacheItem) {
    console.log('Manifest storage cache hit for version', { version })
    return {
      data: possibleCacheItem,
      version
    }
  }

  console.log('No cache hit for manifest version', { version })

  const manifestTables = await getDestinyManifestSlice($http, {
    destinyManifest: destinyManifest!,
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
    arr.push(def)
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

  storage.setItem(cacheKey, data)
  return { data, version }
}

export const loadMinimalManifest = async () => {
  const version = useRuntimeConfig().public.manifestVersion
  const { data } = await loadManifest(version)
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