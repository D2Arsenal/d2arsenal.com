import type { DestinyItemInvestmentStatDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';
import { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js';

type StatDisplayType = 'bar' | 'none'

const DISALLOWED_FOR_STAT_BAR = [4284893193, 3871231066, 2961396640, 447667954, 1931675084, 2715839340]
const displayTypeForStatHash = (hash: number): StatDisplayType => {
  if (!DISALLOWED_FOR_STAT_BAR.includes(hash)) {
    return 'bar'
  }
  return 'none'
}


const statsWithBoundaries = [
  'Impact',
  'Stability',
  'Reload Speed',
  'Handling',
  'Aim Assistance',
  'Zoom',
  'Airborne Effectiveness',
  'Recoil Direction'
]

export type Stat = {
  name: string
  hash: number,
  displayType: StatDisplayType,
  value: number,
  hasBoundary: boolean,
}

const isDefinition = (x: DestinyStatGroupDefinition | DefinitionRecord<DestinyStatGroupDefinition>): x is DestinyStatGroupDefinition => {
  return 'scaledStats' in x
}
export const getStatsForItem = (stats: DestinyStatDefinition[] | DefinitionRecord<DestinyStatDefinition>, item: PrunedDestinyInventoryItemDefinition, statGroupEntryOrRecord: DestinyStatGroupDefinition | DefinitionRecord<DestinyStatGroupDefinition>) => {
  const statGroupEntry = isDefinition(statGroupEntryOrRecord)
    ? statGroupEntryOrRecord
    : getStatGroupEntryForItem(item, statGroupEntryOrRecord)

  const statsArray = Array.isArray(stats)
    ? stats
    : getStatsForStatGroup(statGroupEntry ?? item.investmentStats, stats)

  return statsArray
    .map(stat => {
      const investmentValue = item.investmentStats.find(e => e.statTypeHash === stat.hash)?.value
      const interpolations = statGroupEntry?.scaledStats.find(s => s.statHash === stat.hash)?.displayInterpolation ?? []

      const name = stat.displayProperties.name
      const value = interpolations.find(i => i.value === investmentValue)?.weight ?? investmentValue ?? 0

      return {
        name,
        hash: stat.hash,
        displayType: displayTypeForStatHash(stat.hash),
        value,
        hasBoundary: statsWithBoundaries.includes(name)
      }
    })
    .filter(x => x.name)
}

const isStatGroup = (x: DestinyStatGroupDefinition | DestinyItemInvestmentStatDefinition[]): x is DestinyStatGroupDefinition => {
  return 'scaledStats' in x
}
export function getStatsForStatGroup (statGroupOrInvestmentStats: DestinyStatGroupDefinition | DestinyItemInvestmentStatDefinition[], stats: DefinitionRecord<DestinyStatDefinition>) {
  if (isStatGroup(statGroupOrInvestmentStats)) {
    return statGroupOrInvestmentStats.scaledStats.map(s => stats[s.statHash]).filter(u => u)
  }
  return statGroupOrInvestmentStats.map(s => stats[s.statTypeHash]).filter(u => u)
}

export function getStatGroupEntryForItem (item: PrunedDestinyInventoryItemDefinition, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) {
  const statHash = item.stats?.statGroupHash
  if (!statHash) {
    return
  }
  return statGroups[statHash]
}