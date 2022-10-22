import type { PrunedDestinyInventoryItemDefinition } from "~/types/destiny";
import type { DefinitionRecord } from "~/types";
import type { DestinySandboxPerkDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2";

export const buildMods = (mods: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>, sandboxPerks: DefinitionRecord<DestinySandboxPerkDefinition>) => {
  return mods.map(mod => {
    const perk = sandboxPerks[mod.perks[0]?.perkHash ?? -1];
    if (!perk) {
      return mod
    }

    return {
      ...mod,
      displayProperties: {
        ...mod.displayProperties,
        description: perk.displayProperties.description
      }
    };
  })
}