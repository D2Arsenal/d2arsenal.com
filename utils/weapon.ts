import { TierType } from 'bungie-api-ts/destiny2'
import type { PrunedDestinyInventoryItemDefinition } from '../types/destiny'

export interface MinimalWeapon {
  hash: number
  name: string
  icon: string
  watermark: string
}

export const isExotic = (weapon: PrunedDestinyInventoryItemDefinition) => weapon.inventory?.tierType === TierType.Exotic

export const getMinimalWeapons = (weapons: PrunedDestinyInventoryItemDefinition[]) => weapons.map(weapon => ({
  hash: weapon.hash,
  name: weapon.displayProperties.name,
  icon: weapon.displayProperties.icon,
  watermark: weapon.iconWatermark,
}))

const SUGGESTED_WEAPON_HASHES = [
  2208405142, // Telesto for fun
  2221264583,
  1937552980,
  431721920,
  3969066556,
  3228096719,
  1321506184,
  2218569744,
  1509167284,
  2531963421,
  1184309824,
  1298815317,
  820890091,
  616582330,
  2671639706,
  2988121501,
  1141927949,
  711889599,
  2307365,
  912150785,
  2378101424,
  1532276803,
  4009352833,
]
export const getSuggestedWeapons = (weapons: PrunedDestinyInventoryItemDefinition[]) => {
  const minimal = getMinimalWeapons(weapons)

  const suggestedWeapon = minimal
    .filter(w => SUGGESTED_WEAPON_HASHES.includes(w.hash))
    .sort((a, b) => SUGGESTED_WEAPON_HASHES.indexOf(a.hash) - SUGGESTED_WEAPON_HASHES.indexOf(b.hash))

  return suggestedWeapon
}
