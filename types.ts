type DamageType = {
  blacklisted: boolean,
  displayProperties: {
    description: string,
    hasIcon: boolean,
    icon?: string,
    name: string
  },
  enumValue: number,
  hash: number,
  index: number,
  redacted: boolean,
  showIcon: boolean,
  transparentIconPath: string
}
type FrameIconSequence = {
  frames: string[],
}
type FrameTooltipNotification = {
  displayString: string,
  displayStyle: string

}
type FrameBackgroundColor = {
  colorHash: number
  red: number,
  green: number,
  blue: number,
  alpha: number
}
type FrameAction = {
  verbName: string, // TODO: Enum, but maybe to many?
  verbDescription: string,
  isPositive: boolean,
  requiredCooldownSeconds: number,
  requiredItems: [], // TODO: What?
  progressionRewards: [], // TODO: What?
  actionTypeLabel: string,
  rewardSheetHash: number,
  rewardItemHash: number,
  rewardSiteHash: number,
  requiredCooldownHash: number,
  deleteOnAction: boolean,
  consumeEntireStack: boolean,
  useOnAcquire: boolean
}
type FrameInventory = {
  maxStackSize: number,
  bucketTypeHash: number,
  recoveryBucketTypeHash: number,
  tierTypeHash: number,
  isInstanceItem: boolean,
  nonTransferrableOriginal: boolean,
  tierTypeName: string, // TODO: Enum for strings?
  tierType: number, // TODO: Enum with mapping tierType -> typeName
  expirationTooltip: string,
  expiredInActivityMessage: string,
  expiredInOrbitMessage: string,
  suppressExpirationWhenObjectivesComplete: boolean
}
type FramePlug = {
  insertionRules: [], // TODO Unclear - empty array
  plugCategoryIdentifier: string, // TODO: Enum?
  plugCategoryHash: number,
  onActionRecreateSelf: boolean,
  actionRewardSiteHash: number,
  actionRewardItemOverrideHash: number,
  insertionMaterialRequirementHash: number,
  previewItemOverrideHash: number,
  enabledMaterialRequirementHash: number,
  enabledRules: [], // TODO: Unclear - empty array
  uiPlugLabel: string,
  plugStyle: number, // TODO: Enum
  plugAvailability: number, // TODO: Enum?
  alternateUiPlugLabel: number,
  alternatePlugStyle: number, // TODO: Enum
  isDummyPlug: boolean,
  applyStatsToSocketOwnerItem: boolean
}
type FrameStats = {
  statTypeHash: number,
  value: number,
  isConditionallyActive: boolean
}
type FramePerk = {
  requirementDisplayString: string,
  perkHash: number,
  perkVisibility: number // TODO: Was 0 - enum?
}
type Frame = {
  displayProperties: {
    description: string,
    name: string,
    icon: string,
    iconSequences: FrameIconSequence[],
    hasIcon: boolean
  },
  tooltipNotifications: FrameTooltipNotification[],
  backgroundColor: FrameBackgroundColor,
  itemTypeDisplayName: string,
  flavorText: string,
  uiItemDisplayStyle: string,
  itemTypeAndTierDisplayName: string,
  displaySource: string,
  tooltipStyle: string,
  action: FrameAction,
  inventory: FrameInventory,
  plug: FramePlug,
  acquireRewardSiteHash: number,
  acquireUnlockHash: number,
  investmentStats: FrameStats[],
  perks: FramePerk[],
  summaryItemHash: number,
  allowActions: boolean,
  doesPostmasterPullHaveSideEffects: boolean,
  nonTransferrable: boolean,
  itemCategoryHashes: number[],
  specialItemType: number, // TODO: Enum
  itemType: number, // TODO: Enum
  itemSubType: number, // TODO: Enum
  classType: number, // TODO: Enum
  breakerType: number, // TODO: Enum
  equippable: boolean,
  defaultDamageType: number, // TODO: Enum
  isWrapper: boolean,
  hash: number,
  index: number,
  redacted: boolean,
  blacklisted: boolean
}