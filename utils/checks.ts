import { DestinyItemType } from 'bungie-api-ts/destiny2';
import type { DestinyInventoryItemDefinition, DestinySandboxPerkDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '../types';
import { PrunedDestinyInventoryItemDefinition } from '../types/destiny';

const HASHES = {
  WEAPON_MOD: 1052191496,
  WEAPON_TRAIT: [3708671066, 3085181971, 4184407433, 2411768833, 3866509906, 1334054322, 2076918099, 1709863189, 3072652064, 444756050, 3360831066, 3836367751, 3055157023],
  MASTERWORK: 268598612,
  CATALYST: 59,
}

const PLUG_CATEGORY_IDENTIFIERS = {
  WEAPON_MOD: "v400"
}

const ITEM_TYPE_DISPLAY_NAMES = {
  WEAPON_TRAIT: ["Haft", "Enhanced Trait", "Origin Trait"],
  WEAPON_FRAME: "Intrinsic"
}


export const isWeaponMod = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => itemDef.itemCategoryHashes?.includes(HASHES.WEAPON_MOD)
  && itemDef.plug?.plugCategoryIdentifier.includes(PLUG_CATEGORY_IDENTIFIERS.WEAPON_MOD)

export const isWeapon = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => itemDef.itemType === DestinyItemType.Weapon
export const isWeaponTrait = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => {
  if (ITEM_TYPE_DISPLAY_NAMES.WEAPON_TRAIT.includes(itemDef.itemTypeDisplayName)) {
    return true
  }
  return HASHES.WEAPON_TRAIT.some(((t) => itemDef.itemCategoryHashes?.includes(t)))
}

export const isWeaponFrame = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => itemDef.itemTypeDisplayName?.includes(ITEM_TYPE_DISPLAY_NAMES.WEAPON_FRAME)

export const isMasterwork = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => itemDef.itemCategoryHashes?.includes(HASHES.MASTERWORK)

export const isCatalyst = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => itemDef.itemCategoryHashes?.includes(HASHES.CATALYST)

const DEF_CHECKS = [isWeapon, isWeaponTrait, isWeaponFrame, isMasterwork, isCatalyst, isWeaponMod]
export const isUsedItemDefinition = (itemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => DEF_CHECKS.some((check) => check(itemDef))

export const isSandboxMod = (sandboxPerks: DefinitionRecord<DestinySandboxPerkDefinition>) => (weaponModItemDef: DestinyInventoryItemDefinition | PrunedDestinyInventoryItemDefinition) => sandboxPerks[weaponModItemDef.perks[0]?.perkHash]