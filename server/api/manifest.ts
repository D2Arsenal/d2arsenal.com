import { joinURL } from "ufo"

const urlPrefix = 'https://www.bungie.net'
const MAIN_URL = joinURL(urlPrefix, '/Platform/Destiny2/Manifest/')

export default defineEventHandler(async () => {
  const { Response: manifestResponse } = await $fetch<any>(MAIN_URL)
  const subManifest = manifestResponse.jsonWorldComponentContentPaths.en

  const definitions = {
    itemDefs: joinURL(MAIN_URL, subManifest.DestinyInventoryItemDefinition),
    itemTiers: joinURL(MAIN_URL, subManifest.DestinyItemTierTypeDefinition),
    socketTypes: joinURL(MAIN_URL, subManifest.DestinySocketTypeDefinition),
    statDefs: joinURL(MAIN_URL, subManifest.DestinyStatDefinition),
    statGroups: joinURL(MAIN_URL, subManifest.DestinyStatGroupDefinition),
    plugSets: joinURL(MAIN_URL, subManifest.DestinyPlugSetDefinition),
    damageType: joinURL(MAIN_URL, subManifest.DestinyDamageTypeDefinition),
    sandboxPerks: joinURL(MAIN_URL, subManifest.DestinySandboxPerkDefinition),
    powerCaps: joinURL(MAIN_URL, subManifest.DestinyPowerCapDefinition),
    energyType: joinURL(MAIN_URL, subManifest.DestinyEnergyTypeDefinition),
    collectibles: joinURL(MAIN_URL, subManifest.DestinyCollectibleDefinition)
  }

  type ManifestReturn = any[]
  const [
    itemDefs,
    itemTiers,
    socketTypes,
    statDefs,
    statGroups,
    plugSets,
    damageTypes,
    sandboxPerks,
    powerCaps,
    energyTypes,
    collectibles
  ] = await Promise.all<ManifestReturn>(Object.values(definitions).map(d => $fetch<any>(d)))

  const version = manifestResponse.version

  const weaponMods = Object.values(itemDefs)
    .filter((e) => e.itemCategoryHashes?.includes(1052191496))
    .filter((e) => e.plug?.plugCategoryIdentifier.includes("v400"))

  const data = {
    weapons: Object.values(itemDefs).filter(i => i.itemType === 3),
    weaponTraits: Object.values(itemDefs).filter(e => {
      if (["Haft", "Enhanced Trait", "Origin Trait"].includes(e.itemTypeDisplayName)) {
        return true
      }
      const traitHashes = [3708671066, 3085181971, 4184407433, 2411768833, 3866509906, 1334054322, 2076918099, 1709863189, 3072652064, 444756050, 3360831066, 3836367751, 3055157023]
      return traitHashes.some(((t) => e.itemCategoryHashes?.includes(t)))
    }),
    weaponFrames: Object.values(itemDefs).filter((e) => e.itemTypeDisplayName?.includes("Intrinsic")),
    weaponMods,
    masterworkItems: Object.values(itemDefs).filter((e) => e.itemCategoryHashes?.includes(268598612)),
    catalysts: Object.values(itemDefs).filter((e) => e.itemCategoryHashes?.includes(59)),
    itemTiers,
    socketTypes,
    statDefs,
    statGroups,
    plugSets,
    damageTypes,
    sandboxPerks,
    sandboxMods: weaponMods.map(e => sandboxPerks[e.perks[0]?.perkHash]).filter(Boolean),
    powerCaps,
    seasonCap: 'TODO? Ah, power cap for season currentSeasonRewardPowerCap from uhh, profile call. Can hardcode for now',
    energyTypes,
    collectibles
  }
  return { data, version }
})