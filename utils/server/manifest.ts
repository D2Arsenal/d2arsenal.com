import { getDestinyManifest, getDestinyManifestSlice } from 'bungie-api-ts/destiny2'
import { createStorage } from 'unstorage'
import { $fetch } from 'ohmyfetch'
// @ts-expect-error can't import correctly, maybe in new TS version?
import fsDriver from 'unstorage/drivers/fs'

import type { HttpClientConfig } from 'bungie-api-ts/destiny2'
import pkg from '../../package.json'
import { isCatalyst, isMasterwork, isWeapon, isWeaponFrame, isWeaponMod, isWeaponTrait } from '../checks'
import { toPrunedItemDef, toPrunedPlugSetDef } from '../transforms'

import type { ManifestData, MinimalManifestData } from '../../types'
import type { PrunedDestinyInventoryItemDefinition } from '../../types/destiny'
import { compress, decompress } from './brotli'

const MANIFEST_CACHE_KEY = 'manifest.json'
const NODE_MODULES_CACHE_PATH = './node_modules/.cache/manifest'
const STORAGE_PATH = `assets:server:manifest:${MANIFEST_CACHE_KEY}`

const nodeModulesCacheKeyForVersion = (version: string) => `manifest-${version}-${pkg.version}.json`

const $http = async (config: HttpClientConfig) => $fetch(config.url, {
  method: config.method,
  params: config.params,
  body: config.body,
})

const storage = createStorage({
  driver: fsDriver({ base: './server/assets/manifest' }),
})

const nodeModulesCacheStorage = createStorage({
  driver: fsDriver({ base: NODE_MODULES_CACHE_PATH }),
})

export const fetchBaseManifest = async () => {
  const { Response: destinyManifest } = await getDestinyManifest($http)
  const version = destinyManifest.version
  return { destinyManifest, version }
}

export const fetchManifest = async () => {
  const { destinyManifest, version } = await fetchBaseManifest()

  const manifestTables = await getDestinyManifestSlice($http, {
    destinyManifest,
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
  })

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
    { fn: isMasterwork, arr: masterworks },
  ]

  Object.values(rawItemDefs).forEach((def) => {
    const { arr } = ARR_LOOKUP.find(({ fn }) => fn(def)) ?? {}
    if (!arr) {
      return
    }

    arr.push(toPrunedItemDef(def))
  })

  const prunedPlugSets = Object.fromEntries(
    Object.entries(plugSets).map(([hash, def]) => [hash, toPrunedPlugSetDef(def)]),
  )

  const prunedStatDefs = Object.fromEntries(
    Object.entries(statDefs).map(([hash, def]) => [hash, toPrunedStatDef(def)]),
  )

  const data: ManifestData = {
    weapons,
    frames,
    mods,
    weaponTraits,
    catalysts,
    masterworks,
    itemTiers,
    statDefs: prunedStatDefs,
    statGroups,
    plugSets: prunedPlugSets,
    damageTypes,
    sandboxPerks,
    powerCaps,
    seasonCap: 1580, // TODO Ah, power cap for season currentSeasonRewardPowerCap from uhh, profile call. Can hardcode for now
    energyTypes,
  }

  return { data, version }
}

export const loadManifestFromNodeModulesCache = async () => {
  // TODO: What if endpoint is not available?
  const { version } = await fetchBaseManifest()

  const possibleManifest = await nodeModulesCacheStorage.getItem(nodeModulesCacheKeyForVersion(version)) as { data: ManifestData; version: string } | null
  return possibleManifest
}

export const copyManifestFromNodeModulesCacheIfAvailable = async (skipCache = false) => {
  if (!skipCache) {
    // eslint-disable-next-line no-console
    console.log('Try loading manifest from node_modules cache')
    const possibleManifest = await loadManifestFromNodeModulesCache()
    if (possibleManifest) {
      // eslint-disable-next-line no-console
      console.log('Found manifest in node_modules cache, copying over')
      return storage.setItem(MANIFEST_CACHE_KEY, possibleManifest)
    }
  }
  const msg = skipCache
    ? 'Skipped loading manifest from node_modules cache'
    : 'Did not find manifest in node_modules cache, fetching new'
  // eslint-disable-next-line no-console
  console.log(msg)

  const { data, version } = await fetchManifest()
  const compressed = await compress(JSON.stringify({ data, version }))

  // TODO: Clean .cache/manifest folder?
  const nodeModulesCacheKey = nodeModulesCacheKeyForVersion(version)
  // eslint-disable-next-line no-console
  console.log(`Saved manifest to node modules cache - ${nodeModulesCacheKey}`)
  await Promise.all([
    storage.setItem(MANIFEST_CACHE_KEY, compressed),
    nodeModulesCacheStorage.setItem(nodeModulesCacheKey, compressed),
  ])
}

export const loadManifest = async (fromConfig = false) => {
  const getItemPromise = fromConfig
    ? storage.getItem(MANIFEST_CACHE_KEY)
    : useStorage().getItem(STORAGE_PATH)

  const possibleCacheItem = await getItemPromise as { data: ManifestData; version: string }
  return JSON.parse(await decompress(JSON.stringify(possibleCacheItem))) as { data: ManifestData; version: string }
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
    energyTypes: data.energyTypes,
  }
  return { minimalManifest, version }
}
