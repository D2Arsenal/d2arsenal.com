import type { DestinyInventoryItemDefinition, TierType } from 'bungie-api-ts/destiny2';
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
  'plug'
> & {
  inventory?: {
    tierType: TierType
  },
  plug?: {
    plugCategoryIdentifier: string
  }
};