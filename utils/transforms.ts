import type { DestinyInventoryItemDefinition, DestinyPlugSetDefinition, DestinySandboxPerkDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinySandboxPerkDefinition, PrunedDestinyStatDefinition, PrunedDestinyStatGroupDefinition, PrunedPlugSetDefinition } from '~/types/destiny'

// Needed for range calc
const ALLOWED_TRAIT_IDS = [
  'foundry.field_forged',
  'foundry.veist',
  'foundry.suros',
]
export const toPrunedItemDef = (def: DestinyInventoryItemDefinition): PrunedDestinyInventoryItemDefinition => {
  const traitIds = def.traitIds?.filter(t => ALLOWED_TRAIT_IDS.includes(t))
  return {
    name: def.displayProperties.name,
    description: def.displayProperties.description,
    icon: def.displayProperties.icon,
    iconWatermark: def.iconWatermark,
    screenshot: def.screenshot,
    itemTypeDisplayName: def.itemTypeDisplayName,
    stats: def.stats,
    traitIds: traitIds.length ? traitIds : undefined,
    plugCategoryIdentifier: def.plug?.plugCategoryIdentifier,
    sockets: def.sockets && {
      socketEntries: def.sockets.socketEntries.map(e => ({
        socketTypeHash: e.socketTypeHash,
        singleInitialItemHash: e.singleInitialItemHash,
        reusablePlugItems: e.reusablePlugItems,
        reusablePlugSetHash: e.reusablePlugSetHash,
        randomizedPlugSetHash: e.randomizedPlugSetHash,
        preventInitializationOnVendorPurchase: e.preventInitializationOnVendorPurchase,
      })),
      socketCategories: def.sockets.socketCategories,
    },
    investmentStats: def.investmentStats,
    perkHashes: def.perks?.map(p => p.perkHash),
    itemCategoryHashes: def.itemCategoryHashes,
    itemType: def.itemType,
    itemSubType: def.itemSubType,
    damageTypeHashes: def.damageTypeHashes,
    hash: def.hash,
    redacted: def.redacted,
    tierType: def.inventory?.tierType,
    // These are not needed yet but will likely in the future
    // classType: def.classType,
    // defaultDamageType: def.defaultDamageType
  }
}

export const toPrunedPlugSetDef = (def: DestinyPlugSetDefinition): PrunedPlugSetDefinition => {
  return {
    displayProperties: def.displayProperties,
    hash: def.hash,
    redacted: def.redacted,
    reusablePlugItems: def.reusablePlugItems?.map(i => ({
      currentlyCanRoll: i.currentlyCanRoll,
      plugItemHash: i.plugItemHash,
      requiredLevel: i.craftingRequirements?.requiredLevel,
    })),
  }
}

export const toPrunedStatDef = (def: DestinyStatDefinition): PrunedDestinyStatDefinition => ({
  name: def.displayProperties.name,
  hash: def.hash,
})

export const toPrunedStatGroupDef = (def: DestinyStatGroupDefinition): PrunedDestinyStatGroupDefinition => ({
  hash: def.hash,
  maximumValue: def.maximumValue,
  scaledStats: def.scaledStats,
})

export const toPrunedSandboxPerkDef = (def: DestinySandboxPerkDefinition): PrunedDestinySandboxPerkDefinition => ({
  name: def.displayProperties.name,
  description: def.displayProperties.description,
  icon: def.displayProperties.icon,
  hash: def.hash,
})
