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
  // TODO: These are not needed right now but might be in the future
  'classType' |
  'defaultDamageType'
> & {
  inventory?: {
    tierType: TierType
  }
  plug?: {
    plugCategoryIdentifier: string
  }
  perks?: Omit<DestinyItemPerkEntryDefinition,
    'requirementDisplayString' | 'perkVisibility'>[]
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
  craftingRequirements: Omit<DestinyPlugItemCraftingRequirements,
    'unlockRequirements' |
    'materialRequirementHashes'
  >
}

export type PrunedPlugSetDefinition = Omit<
  DestinyPlugSetDefinition,
  'isFakePlugSet' |
  'index' |
  'reusablePlugItems'
> & {
  reusablePlugItems?: PrunedItemSocketEntryPlugItemRandomizedDefinition[]
}

export interface PrunedDestinyStatDefinition {
  displayProperties: DestinyStatDefinition['displayProperties']
  hash: number
}

export interface PrunedDestinyStatGroupDefinition {
  hash: DestinyStatGroupDefinition['hash']
  maximumValue: DestinyStatGroupDefinition['maximumValue']
  scaledStats: DestinyStatGroupDefinition['scaledStats']
}
