import { TierType } from 'bungie-api-ts/destiny2';
import type { PrunedDestinyInventoryItemDefinition } from '../types/destiny';

export type MinimalWeapon = {
  hash: number;
  name: string;
  icon: string;
  watermark: string;
}

export const isExotic = (weapon: PrunedDestinyInventoryItemDefinition) => weapon.inventory?.tierType === TierType.Exotic

export const getMinimalWeapons = (weapons: PrunedDestinyInventoryItemDefinition[]) => weapons.map((weapon) => ({
  hash: weapon.hash,
  name: weapon.displayProperties.name,
  icon: weapon.displayProperties.icon,
  watermark: weapon.iconWatermark,
}))