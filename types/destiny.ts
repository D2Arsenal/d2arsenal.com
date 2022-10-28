import type { DestinyInventoryItemDefinition, DestinyItemSocketCategoryDefinition, DestinyItemSocketEntryDefinition, TierType } from 'bungie-api-ts/destiny2';
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
  'sockets'
> & {
  inventory?: {
    tierType: TierType
  },
  plug?: {
    plugCategoryIdentifier: string
  },
  sockets?: {
    socketEntries: Omit<DestinyItemSocketEntryDefinition,
      'preventInitializationOnVendorPurchase' |
      'hidePerksInItemTooltip' |
      'plugSources' |
      'defaultVisible'>[],
    socketCategories: DestinyItemSocketCategoryDefinition[]
  }
};