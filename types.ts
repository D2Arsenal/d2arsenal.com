import type { DestinyDamageTypeDefinition, DestinyEnergyTypeDefinition, DestinyItemTierTypeDefinition, DestinyPowerCapDefinition, DestinySandboxPerkDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinyStatDefinition, PrunedPlugSetDefinition } from './types/destiny'

export type DefinitionRecord<T> = Record<number, T>

export interface ManifestData {
  weapons: PrunedDestinyInventoryItemDefinition[]
  frames: PrunedDestinyInventoryItemDefinition[]
  mods: PrunedDestinyInventoryItemDefinition[]
  catalysts: PrunedDestinyInventoryItemDefinition[]
  masterworks: PrunedDestinyInventoryItemDefinition[]
  weaponTraits: PrunedDestinyInventoryItemDefinition[]
  itemTiers: DefinitionRecord<DestinyItemTierTypeDefinition>
  statDefs: DefinitionRecord<PrunedDestinyStatDefinition>
  statGroups: DefinitionRecord<DestinyStatGroupDefinition>
  plugSets: DefinitionRecord<PrunedPlugSetDefinition>
  damageTypes: DefinitionRecord<DestinyDamageTypeDefinition>
  sandboxPerks: DefinitionRecord<DestinySandboxPerkDefinition>
  powerCaps: DefinitionRecord<DestinyPowerCapDefinition>
  seasonCap: number
  energyTypes: DefinitionRecord<DestinyEnergyTypeDefinition>
}

export type MinimalManifestData = Omit<ManifestData,
  'weapons' |
  'frames' |
  'weaponTraits' |
  'masterworks' |
  'catalysts'
>
