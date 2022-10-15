import { DestinyDamageTypeDefinition, DestinyInventoryItemDefinition, DestinyItemTierTypeDefinition, DestinyPlugSetDefinition, DestinySandboxPerkDefinition, DestinySocketTypeDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2"
import { DestinyCollectibleDefinition, DestinyEnergyTypeDefinition, DestinyPowerCapDefinition } from "bungie-api-ts/destiny2/interfaces.js"

export type ManifestData = {
  weapons: DestinyInventoryItemDefinition[],
  weaponTraits: DestinyInventoryItemDefinition[],
  weaponFrames: DestinyInventoryItemDefinition[],
  weaponMods: DestinyInventoryItemDefinition[],
  masterworkItems: DestinyInventoryItemDefinition[],
  catalysts: DestinyInventoryItemDefinition[],
  itemTiers: Record<string, DestinyItemTierTypeDefinition>,
  socketTypes: Record<string, DestinySocketTypeDefinition>,
  statDefs: Record<string, DestinyStatDefinition>,
  statGroups: Record<string, DestinyStatGroupDefinition>,
  plugSets: Record<string, DestinyPlugSetDefinition>,
  damageTypes: Record<string, DestinyDamageTypeDefinition>,
  sandboxPerks: Record<string, DestinySandboxPerkDefinition>,
  sandboxMods: DestinySandboxPerkDefinition[],
  powerCaps: Record<string, DestinyPowerCapDefinition>,
  seasonCap: number,
  energyTypes: Record<string, DestinyEnergyTypeDefinition>,
  collectibles: Record<string, DestinyCollectibleDefinition>
}