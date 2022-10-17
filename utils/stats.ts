import type { DestinyInventoryItemDefinition, DestinyItemInvestmentStatDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2';
import type { DefinitionRecord } from '~/types';

type GetSingleStatForItemArgs = {
  item: DestinyInventoryItemDefinition,
  statDefinitions: DefinitionRecord<DestinyStatDefinition>
}

const DISALLOWED_FOR_STAT_BAR = [4284893193, 3871231066, 2961396640, 447667954, 1931675084, 2715839340]
const displayTypeForStatHash = (hash: number) => {
  if (!DISALLOWED_FOR_STAT_BAR.includes(hash)) {
    return 'bar'
  }
  return 'none'
}

export type Stat = {
  name: string
  hash: number,
  displayType: 'bar' | 'none',
  value: number
}

const isDefinition = (x: DestinyStatGroupDefinition | DefinitionRecord<DestinyStatGroupDefinition>): x is DestinyStatGroupDefinition => {
  return 'scaledStats' in x
}
export const getStatsForItem = (stats: DestinyStatDefinition[] | DefinitionRecord<DestinyStatDefinition>, item: DestinyInventoryItemDefinition, statGroupEntryOrRecord: DestinyStatGroupDefinition | DefinitionRecord<DestinyStatGroupDefinition>) => {
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

      return {
        name: stat.displayProperties.name,
        hash: stat.hash,
        displayType: displayTypeForStatHash(stat.hash),
        value: interpolations.find(i => i.value === investmentValue)?.weight ?? investmentValue
      }
    })
    .filter(x => x.name)
    .sort((a, b) => {
      if (b.displayType === 'bar') {
        return 1
      }
      if (a.displayType === 'bar') {
        return -1
      }
      return 0
    })
}

/**
 * TODO: Broken/WIP
 * @fixme
 */
export const getSingleStatForItem = ({ item, statDefinitions }: GetSingleStatForItemArgs) =>
  item.investmentStats.flatMap((item) => {
    const stat = statDefinitions[item.statTypeHash];
    if (!stat.displayProperties.name) {
      return [];
    }
    return {
      name: stat.displayProperties.name,
      value: 0
    }
  })

const isStatGroup = (x: DestinyStatGroupDefinition | DestinyItemInvestmentStatDefinition[]): x is DestinyStatGroupDefinition => {
  return 'scaledStats' in x
}
export function getStatsForStatGroup (statGroupOrInvestmentStats: DestinyStatGroupDefinition | DestinyItemInvestmentStatDefinition[], stats: DefinitionRecord<DestinyStatDefinition>) {
  if (isStatGroup(statGroupOrInvestmentStats)) {
    return statGroupOrInvestmentStats.scaledStats.map(s => stats[s.statHash]).filter(u => u)
  }
  return statGroupOrInvestmentStats.map(s => stats[s.statTypeHash]).filter(u => u)
}

export function getStatGroupEntryForItem (item: DestinyInventoryItemDefinition, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) {
  const statHash = item.stats?.statGroupHash
  if (!statHash) {
    return
  }
  return statGroups[statHash]
}