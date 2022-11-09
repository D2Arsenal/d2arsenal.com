import type { DestinyItemInvestmentStatDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import type { DefinitionRecord } from '~/types'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js'

type StatDisplayType = 'bar' | 'none'

const STAT_MAPPING = {
  STABILITY: 155624089,
  GUARD_RESISTANCE: 209426660,
  DRAW_TIME: 447667954,
  AMMO_CAPACITY: 925767036,
  HANDLING: 943549884,
  RANGE: 1240592695,
  AIM_ASSISTANCE: 1345609583,
  ACCURACY: 1591432999,
  SHIELD_DURATION: 1842278586,
  INVENTORY_SIZE: 1931675084,
  VELOCITY: 2523465841,
  AIRBORNE_EFFECTIVENESS: 2714457168,
  RECOIL_DIRECTION: 2715839340,
  GUARD_EFFICIENCY: 2762071195,
  SWING_SPEED: 2837207746,
  CHARGE_TIME: 2961396640,
  CHARGE_RATE: 3022301683,
  ZOOM: 3555269338,
  BLAST_RADIUS: 3614673599,
  GUARD_ENDURANCE: 3736848092,
  MAGAZINE: 3871231066,
  IMPACT: 4043523819,
  RELOAD_SPEED: 4188031367,
  ROUNDS_PER_MINUTE: 4284893193,
}

export const STAT_HASH_ORDER = [
  STAT_MAPPING.BLAST_RADIUS,
  STAT_MAPPING.VELOCITY,
  STAT_MAPPING.IMPACT,
  STAT_MAPPING.RANGE,
  STAT_MAPPING.ACCURACY,
  STAT_MAPPING.STABILITY,
  STAT_MAPPING.SHIELD_DURATION,
  STAT_MAPPING.HANDLING,
  STAT_MAPPING.RELOAD_SPEED,
  STAT_MAPPING.SWING_SPEED,
  STAT_MAPPING.CHARGE_RATE,
  STAT_MAPPING.GUARD_RESISTANCE,
  STAT_MAPPING.GUARD_EFFICIENCY,
  STAT_MAPPING.GUARD_ENDURANCE,
  STAT_MAPPING.AIM_ASSISTANCE,
  STAT_MAPPING.AIRBORNE_EFFECTIVENESS,
  STAT_MAPPING.ZOOM,
  STAT_MAPPING.RECOIL_DIRECTION,
  STAT_MAPPING.ROUNDS_PER_MINUTE,
  STAT_MAPPING.CHARGE_TIME,
  STAT_MAPPING.DRAW_TIME,
  STAT_MAPPING.MAGAZINE,
  STAT_MAPPING.INVENTORY_SIZE,
  STAT_MAPPING.AMMO_CAPACITY,
]

const DISALLOWED_FOR_STAT_BAR = [
  STAT_MAPPING.ROUNDS_PER_MINUTE,
  STAT_MAPPING.MAGAZINE,
  STAT_MAPPING.CHARGE_TIME,
  STAT_MAPPING.DRAW_TIME,
  STAT_MAPPING.INVENTORY_SIZE,
  STAT_MAPPING.RECOIL_DIRECTION,
]
const displayTypeForStatHash = (hash: number): StatDisplayType => {
  if (!DISALLOWED_FOR_STAT_BAR.includes(hash)) { return 'bar' }

  return 'none'
}

export interface Stat {
  name: string
  hash: number
  displayType: StatDisplayType
  value: number
  maximumValue: number
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
    .map((stat) => {
      const investmentValue = item.investmentStats.find(e => e.statTypeHash === stat.hash)?.value
      const scaledStat = statGroupEntry?.scaledStats.find(s => s.statHash === stat.hash)
      const interpolations = scaledStat?.displayInterpolation ?? []

      const name = stat.displayProperties.name
      const possibleInterpolation = interpolations.find(i => i.value === investmentValue)
      const value = possibleInterpolation?.weight ?? investmentValue ?? 0

      return {
        name,
        hash: stat.hash,
        displayType: displayTypeForStatHash(stat.hash),
        value,
        maximumValue: scaledStat?.maximumValue ?? -Infinity,
      }
    })
    .filter(x => x.name)
}

const isStatGroup = (x: DestinyStatGroupDefinition | DestinyItemInvestmentStatDefinition[]): x is DestinyStatGroupDefinition => {
  return 'scaledStats' in x
}
export function getStatsForStatGroup(statGroupOrInvestmentStats: DestinyStatGroupDefinition | DestinyItemInvestmentStatDefinition[], stats: DefinitionRecord<DestinyStatDefinition>) {
  if (isStatGroup(statGroupOrInvestmentStats)) { return statGroupOrInvestmentStats.scaledStats.map(s => stats[s.statHash]).filter(u => u) }

  return statGroupOrInvestmentStats.map(s => stats[s.statTypeHash]).filter(u => u)
}

export function getStatGroupEntryForItem(item: PrunedDestinyInventoryItemDefinition, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) {
  const statHash = item.stats?.statGroupHash
  if (!statHash) { return }

  return statGroups[statHash]
}
