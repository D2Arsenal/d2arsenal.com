import { mods as modInfo } from '~/utils/info'
import { getStatsForItem } from '~/utils/stats'

import type { PrunedDestinyInventoryItemDefinition, PrunedDestinySandboxPerkDefinition, PrunedDestinyStatDefinition, PrunedDestinyStatGroupDefinition } from '~/types/destiny'
import type { Stat } from '~/utils/stats'
import type { DefinitionRecord } from '~/types'

export interface Mod {
  mod: PrunedDestinyInventoryItemDefinition
  subDescription?: string
  stats: Stat[]
}

export const buildMods = (mods: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<PrunedDestinyStatDefinition>, statGroups: DefinitionRecord<PrunedDestinyStatGroupDefinition>, sandboxPerks: DefinitionRecord<PrunedDestinySandboxPerkDefinition>) => {
  return mods.map((mod) => {
    const perk = sandboxPerks[mod.perkHashes?.[0] ?? -1]

    return {
      mod: {
        ...mod,
        description: perk?.description ?? mod.description,
      },
      subDescription: modInfo[mod.hash]?.description,
      stats: getStatsForItem(stats, mod, statGroups) ?? [],
    } as Mod
  })
}
