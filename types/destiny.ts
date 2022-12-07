import type { DestinyInventoryItemDefinition, DestinyItemPerkEntryDefinition, DestinyItemSocketCategoryDefinition, DestinyItemSocketEntryDefinition, DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyPlugItemCraftingRequirements, DestinyPlugSetDefinition, DestinyStatDefinition, DestinyStatGroupDefinition, TierType } from 'bungie-api-ts/destiny2'
export type PrunedDestinyInventoryItemDefinition = Omit<
  DestinyInventoryItemDefinition,
  'tooltipNotifications' |
  'iconWatermarkShelved' |
  'secondaryIcon' |
  'secondaryOverlay' |
  'secondarySpecial' |
  'backgroundColor' |
  'flavorText' |
  'uiItemDisplayStyle' |
  'itemTypeAndTierDisplayName' |
  'displaySource' |
  'tooltipStyle' |
  'crafting' |
  'value' |
  'summary' |
  'animations' |
  'allowActions' |
  'links' |
  'doesPostmasterPullHaveSideEffects' |
  'nonTransferrable' |
  'specialItemType' |
  'breakerType' |
  'equippable' |
  'damageTypes' |
  'isWrapper' |
  'traitIds' |
  'traitHashes' |
  'index' |
  'inventory' |
  'plug' |
  'sockets' |
  'perks' |
  'displayProperties' |
  // TODO: These are not needed right now but might be in the future
  'classType' |
  'defaultDamageType'
> & {
  name: DestinyInventoryItemDefinition['displayProperties']['name']
  description: DestinyInventoryItemDefinition['displayProperties']['description']
  icon: DestinyInventoryItemDefinition['displayProperties']['icon']
  tierType?: TierType
  plugCategoryIdentifier?: string
  perkHashes?: DestinyItemPerkEntryDefinition['perkHash'][]
  sockets?: {
    socketEntries: Omit<DestinyItemSocketEntryDefinition,
      'hidePerksInItemTooltip' |
      'plugSources' |
      'defaultVisible'>[]
    socketCategories: DestinyItemSocketCategoryDefinition[]
  }
}

export type PrunedItemSocketEntryPlugItemRandomizedDefinition = Omit<
  DestinyItemSocketEntryPlugItemRandomizedDefinition,
  'craftingRequirements'
> & {
  requiredLevel?: DestinyPlugItemCraftingRequirements['requiredLevel']
}

export type PrunedPlugSetDefinition = Omit<
  DestinyPlugSetDefinition,
  'isFakePlugSet' |
  'index' |
  'reusablePlugItems' |
  'weight' |
  'alternateWeight'
> & {
  reusablePlugItems?: PrunedItemSocketEntryPlugItemRandomizedDefinition[]
}

export interface PrunedDestinyStatDefinition {
  name: DestinyInventoryItemDefinition['displayProperties']['name']
  hash: number
}

export interface PrunedDestinyStatGroupDefinition {
  hash: DestinyStatGroupDefinition['hash']
  maximumValue: DestinyStatGroupDefinition['maximumValue']
  scaledStats: DestinyStatGroupDefinition['scaledStats']
}

export interface PrunedDestinySandboxPerkDefinition {
  name: DestinyInventoryItemDefinition['displayProperties']['name']
  description: DestinyInventoryItemDefinition['displayProperties']['description']
  icon: DestinyInventoryItemDefinition['displayProperties']['icon']
  hash: number
}
