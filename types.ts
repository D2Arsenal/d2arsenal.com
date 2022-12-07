import type { DestinyDamageTypeDefinition, DestinyEnergyTypeDefinition, DestinyItemTierTypeDefinition } from 'bungie-api-ts/destiny2'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinySandboxPerkDefinition, PrunedDestinyStatDefinition, PrunedDestinyStatGroupDefinition, PrunedPlugSetDefinition } from './types/destiny'

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
  statGroups: DefinitionRecord<PrunedDestinyStatGroupDefinition>
  plugSets: DefinitionRecord<PrunedPlugSetDefinition>
  damageTypes: DefinitionRecord<DestinyDamageTypeDefinition>
  sandboxPerks: DefinitionRecord<PrunedDestinySandboxPerkDefinition>
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
