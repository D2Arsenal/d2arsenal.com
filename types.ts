import { DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinyItemTierTypeDefinition, DestinyPlugSetDefinition, DestinySandboxPerkDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2"
import { DestinyCollectibleDefinition, DestinyEnergyTypeDefinition, DestinyPowerCapDefinition } from "bungie-api-ts/destiny2/interfaces.js"

export type DefinitionRecord<T> = Record<number, T>

export type ManifestData = {
  weapons: DestinyInventoryItemDefinition[],
  weaponTraits: DestinyInventoryItemDefinition[],
  weaponFrames: DestinyInventoryItemDefinition[],
  masterworkItems: DestinyInventoryItemDefinition[],
  catalysts: DestinyInventoryItemDefinition[],
  weaponMods: DestinyInventoryItemDefinition[],
  itemTiers: DefinitionRecord<DestinyItemTierTypeDefinition>,
  socketTypes: DefinitionRecord<DestinySocketTypeDefinition>,
  statDefs: DefinitionRecord<DestinyStatDefinition>,
  statGroups: DefinitionRecord<DestinyStatGroupDefinition>,
  plugSets: DefinitionRecord<DestinyPlugSetDefinition>,
  damageTypes: DefinitionRecord<DestinyDamageTypeDefinition>,
  sandboxPerks: DefinitionRecord<DestinySandboxPerkDefinition>,
  sandboxMods: DestinySandboxPerkDefinition[],
  powerCaps: DefinitionRecord<DestinyPowerCapDefinition>,
  seasonCap: number,
  energyTypes: DefinitionRecord<DestinyEnergyTypeDefinition>,
  collectibles: DefinitionRecord<DestinyCollectibleDefinition>
}