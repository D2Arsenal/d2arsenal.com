import { getDestinyManifest, getDestinyManifestSlice } from "bungie-api-ts/destiny2";
import { toPrunedItemDef } from '~/utils/transforms';
import { isUsedItemDefinition } from '~/utils/checks';
import type { HttpClientConfig } from "bungie-api-ts/destiny2";
import type { ManifestData } from "~/types";

import { createStorage } from 'unstorage'
// @ts-ignore
import fsDriver from 'unstorage/drivers/fs'

const FILE_NAME = {
  PREFIX: 'manifest-',
  SUFFIX: '.json'
}

const getCacheKeyForVersion = (version: string) => FILE_NAME.PREFIX + version + FILE_NAME.SUFFIX

async function $http (config: HttpClientConfig) {
  // fill in the API key, handle OAuth, etc., then make an HTTP request using the config.
  return $fetch(config.url, {
    method: config.method,
    params: config.params,
    body: config.body
  });
}

const storage = createStorage({
  driver: fsDriver({ base: './tmp' })
})


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (config.useCachedManifest) {
    const possibleCacheItem = await storage.getItem('manifest.json') as ManifestData | null
    if (possibleCacheItem) {
      return {
        data: possibleCacheItem,
        version: 'OFFLINE'
      }
    }
  }

  const { Response: destinyManifest } = await getDestinyManifest($http);
  const { version } = destinyManifest

  const cacheKey = getCacheKeyForVersion(version)
  const possibleCacheItem = await storage.getItem(cacheKey) as ManifestData | null
  if (possibleCacheItem) {
    return {
      data: possibleCacheItem,
      version
    }
  }

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


  const data: ManifestData = {
    itemDefs: Object.values(rawItemDefs).filter(d => isUsedItemDefinition(d)).map(d => toPrunedItemDef(d)),
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

  // Set ETag to improve caching
  setResponseHeader(event, 'ETag', version)

  return { data, version }
})