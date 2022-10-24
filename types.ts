import { PrunedDestinyInventoryItemDefinition } from './types/destiny';
import type { DestinyEnergyTypeDefinition, DestinyPowerCapDefinition, DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinyItemTierTypeDefinition, DestinyPlugSetDefinition, DestinySandboxPerkDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2"

export type DefinitionRecord<T> = Record<number, T>

export type ManifestData = {
  weapons: PrunedDestinyInventoryItemDefinition[],
  frames: PrunedDestinyInventoryItemDefinition[],
  mods: PrunedDestinyInventoryItemDefinition[],
  catalysts: PrunedDestinyInventoryItemDefinition[],
  masterworks: PrunedDestinyInventoryItemDefinition[],
  weaponTraits: PrunedDestinyInventoryItemDefinition[],
  itemTiers: DefinitionRecord<DestinyItemTierTypeDefinition>,
  statDefs: DefinitionRecord<DestinyStatDefinition>,
  statGroups: DefinitionRecord<DestinyStatGroupDefinition>,
  plugSets: DefinitionRecord<DestinyPlugSetDefinition>,
  damageTypes: DefinitionRecord<DestinyDamageTypeDefinition>,
  sandboxPerks: DefinitionRecord<DestinySandboxPerkDefinition>,
  powerCaps: DefinitionRecord<DestinyPowerCapDefinition>,
  seasonCap: number,
  energyTypes: DefinitionRecord<DestinyEnergyTypeDefinition>,
}

export type MinimalManifestData = Omit<ManifestData,
  'weapons' |
  'frames' |
  'weaponTraits' |
  'masterworks' |
  'catalysts'
>