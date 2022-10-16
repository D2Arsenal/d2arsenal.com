import { getDestinyManifest, getDestinyManifestSlice } from "bungie-api-ts/destiny2";
import type { DestinyItemType, HttpClientConfig } from "bungie-api-ts/destiny2";
import type { ManifestData } from "~/types";

async function $http(config: HttpClientConfig) {
  // fill in the API key, handle OAuth, etc., then make an HTTP request using the config.
  return $fetch(config.url, {
    method: config.method,
    params: config.params,
    body: config.body
  });
}

export default defineEventHandler(async (event) => {
  const { Response: destinyManifest } = await getDestinyManifest($http);
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

  const { version } = destinyManifest

  const {
    DestinyInventoryItemDefinition: itemDefs,
    DestinyItemTierTypeDefinition: itemTiers,
    DestinySocketTypeDefinition: socketTypes,
    DestinyStatDefinition: statDefs,
    DestinyStatGroupDefinition: statGroups,
    DestinyPlugSetDefinition: plugSets,
    DestinyDamageTypeDefinition: damageTypes,
    DestinySandboxPerkDefinition: sandboxPerks,
    DestinyPowerCapDefinition: powerCaps,
    DestinyEnergyTypeDefinition: energyTypes,
    DestinyCollectibleDefinition: collectibles,
  } = manifestTables

  const weaponMods = Object.values(itemDefs)
    .filter((e) => e.itemCategoryHashes?.includes(1052191496))
    .filter((e) => e.plug?.plugCategoryIdentifier.includes("v400"))

  const data: ManifestData = {
    weapons: Object.values(itemDefs).filter(i => i.itemType === DestinyItemType.Weapon).slice(0, 10), // TODO: Remove slice
    weaponTraits: Object.values(itemDefs).filter(e => {
      if (["Haft", "Enhanced Trait", "Origin Trait"].includes(e.itemTypeDisplayName)) {
        return true
      }
      const traitHashes = [3708671066, 3085181971, 4184407433, 2411768833, 3866509906, 1334054322, 2076918099, 1709863189, 3072652064, 444756050, 3360831066, 3836367751, 3055157023]
      return traitHashes.some(((t) => e.itemCategoryHashes?.includes(t)))
    }),
    weaponFrames: Object.values(itemDefs).filter((e) => e.itemTypeDisplayName?.includes("Intrinsic")),
    masterworkItems: Object.values(itemDefs).filter((e) => e.itemCategoryHashes?.includes(268598612)),
    catalysts: Object.values(itemDefs).filter((e) => e.itemCategoryHashes?.includes(59)),
    weaponMods,
    itemTiers,
    socketTypes,
    statDefs,
    statGroups,
    plugSets,
    damageTypes,
    sandboxPerks,
    sandboxMods: weaponMods.map(e => sandboxPerks[e.perks[0]?.perkHash]).filter(Boolean),
    powerCaps,
    seasonCap: 1580,// TODO Ah, power cap for season currentSeasonRewardPowerCap from uhh, profile call. Can hardcode for now
    energyTypes,
    collectibles
  }

  // Set ETag to improve caching
  setResponseHeader(event, 'ETag', version)

  return { data, version }
})