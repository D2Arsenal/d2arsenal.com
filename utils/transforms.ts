import type { DestinyInventoryItemDefinition, DestinyPlugSetDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinyStatDefinition, PrunedDestinyStatGroupDefinition, PrunedPlugSetDefinition } from '~/types/destiny'

export const toPrunedItemDef = (def: DestinyInventoryItemDefinition): PrunedDestinyInventoryItemDefinition => ({
  displayProperties: def.displayProperties,
  iconWatermark: def.iconWatermark,
  screenshot: def.screenshot,
  itemTypeDisplayName: def.itemTypeDisplayName,
  stats: def.stats,
  plug: def.plug && {
    plugCategoryIdentifier: def.plug.plugCategoryIdentifier,
  },
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
  perks: def.perks?.map(p => ({
    perkHash: p.perkHash,
  })),
  itemCategoryHashes: def.itemCategoryHashes,
  itemType: def.itemType,
  itemSubType: def.itemSubType,
  damageTypeHashes: def.damageTypeHashes,
  hash: def.hash,
  redacted: def.redacted,
  inventory: def.inventory && {
    tierType: def.inventory.tierType,
  },
  // These are not needed yet but will likely in the future
  // classType: def.classType,
  // defaultDamageType: def.defaultDamageType
})

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
  displayProperties: def.displayProperties,
  hash: def.hash,
})

export const toPrunedStatGroupDef = (def: DestinyStatGroupDefinition): PrunedDestinyStatGroupDefinition => ({
  hash: def.hash,
  maximumValue: def.maximumValue,
  scaledStats: def.scaledStats,
})
