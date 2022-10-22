import type { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny';

export const toPrunedItemDef = (def: DestinyInventoryItemDefinition) => {
  const newDef: PrunedDestinyInventoryItemDefinition = {
    displayProperties: def.displayProperties,
    iconWatermark: def.iconWatermark,
    screenshot: def.screenshot,
    itemTypeDisplayName: def.itemTypeDisplayName,
    stats: def.stats,
    plug: def.plug && {
      plugCategoryIdentifier: def.plug.plugCategoryIdentifier
    },
    sockets: def.sockets,
    investmentStats: def.investmentStats,
    perks: def.perks,
    itemCategoryHashes: def.itemCategoryHashes,
    itemType: def.itemType,
    itemSubType: def.itemSubType,
    damageTypeHashes: def.damageTypeHashes,
    hash: def.hash,
    redacted: def.redacted,
    inventory: def.inventory && {
      tierType: def.inventory.tierType
    },
    // These are not needed yet but will likely in the future
    classType: def.classType,
    defaultDamageType: def.defaultDamageType
  }
  return newDef
}