import type { DestinySandboxPerkDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import { mods as modInfo } from '~/utils/info'
import { getStatsForItem } from '~/utils/stats'

import type { PrunedDestinyInventoryItemDefinition, PrunedDestinyStatDefinition } from '~/types/destiny'
import type { Stat } from '~/utils/stats'
import type { DefinitionRecord } from '~/types'

export interface Mod {
  mod: PrunedDestinyInventoryItemDefinition
  subDescription?: string
  stats: Stat[]
}

export const buildMods = (mods: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<PrunedDestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>, sandboxPerks: DefinitionRecord<DestinySandboxPerkDefinition>) => {
  return mods.map((mod) => {
    const perk = sandboxPerks[mod.perks?.[0]?.perkHash ?? -1]

    return {
      mod: {
        ...mod,
        displayProperties: {
          ...mod.displayProperties,
          description: perk?.displayProperties.description ?? mod.displayProperties.description,
        },
      },
      subDescription: modInfo[mod.hash]?.description,
      stats: getStatsForItem(stats, mod, statGroups) ?? [],
    } as Mod
  })
}
