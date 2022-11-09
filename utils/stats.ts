import type { DestinyItemInvestmentStatDefinition, DestinyStatDefinition, DestinyStatDisplayDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import type { DefinitionRecord } from '~/types'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny.js'

type StatDisplayType = 'bar' | 'none' | 'ms'

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

export const STAT_ORDER = [
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

const STATS_IN_MS = [
  STAT_MAPPING.DRAW_TIME,
  STAT_MAPPING.CHARGE_TIME,
]

const displayTypeForStatHash = (hash: number): StatDisplayType => {
  if (STATS_IN_MS.includes(hash)) {
    return 'ms'
  }
  if (!DISALLOWED_FOR_STAT_BAR.includes(hash)) { return 'bar' }

  return 'none'
}

export interface Stat {
  investmentValue: number
  hash: number
  name: string
  sort: number
  value: number
  base: number
  maximumValue: number
  displayType: StatDisplayType
  smallerIsBetter: boolean
  isConditionallyActive: boolean
}

const isDefinition = (x: DestinyStatGroupDefinition | DefinitionRecord<DestinyStatGroupDefinition>): x is DestinyStatGroupDefinition => {
  return 'scaledStats' in x
}
export const getStatsForItem = (allStats: DefinitionRecord<DestinyStatDefinition>, item: PrunedDestinyInventoryItemDefinition, statGroupEntryOrRecord: DestinyStatGroupDefinition | DefinitionRecord<DestinyStatGroupDefinition>) => {
  const statGroupEntry = isDefinition(statGroupEntryOrRecord)
    ? statGroupEntryOrRecord
    : getStatGroupEntryForItem(item, statGroupEntryOrRecord)

  if (!statGroupEntry) {
    return []
  }

  const displayStats = statGroupEntry.scaledStats

  const stats = statGroupEntry.scaledStats.map(s => allStats[s.statHash])

  // We only use the raw "investment" stats to calculate all item stats.
  // Stats will be added to the item in the StatsBar component.
  const investmentStats = buildInvestmentStats(item, statGroupEntry, stats, displayStats) ?? []

  return investmentStats
}

function buildInvestmentStats(item: PrunedDestinyInventoryItemDefinition, statGroup: DestinyStatGroupDefinition, allStats: DestinyStatDefinition[], displayStats: DestinyStatDisplayDefinition[]) {
  const itemStats = item.investmentStats || []

  return itemStats.flatMap((itemStat) => {
    const statHash = itemStat.statTypeHash

    const statDef = allStats.find(s => s.hash === statHash)
    if (!statDef) {
      return []
    }

    return buildStat(itemStat, statGroup, statDef, displayStats)
  }).filter(s => !s.isConditionallyActive)
}

/**
 * builds and returns a single Stat, using InvestmentStat information,
 * stat def, statgroup def, and the item's StatDisplayDefinition,
 * which determines which stats are displayed and how they are interpolated
 */
function buildStat(
  itemStat:
  | DestinyItemInvestmentStatDefinition
  | { statTypeHash: number; value: number; isConditionallyActive: boolean },
  statGroup: DestinyStatGroupDefinition,
  statDef: DestinyStatDefinition,
  displayStats: DestinyStatDisplayDefinition[],
): Stat {
  const hash = itemStat.statTypeHash
  let value = itemStat.value ?? 0
  let maximumValue = statGroup.maximumValue
  let bar = !DISALLOWED_FOR_STAT_BAR.includes(hash)
  let smallerIsBetter = false
  const isMs = STATS_IN_MS.includes(hash)

  const statDisplay = displayStats.find(s => s.statHash === hash)
  if (statDisplay) {
    const [firstInterpolation] = statDisplay.displayInterpolation
    const lastInterpolation
      = statDisplay.displayInterpolation[statDisplay.displayInterpolation.length - 1]
    smallerIsBetter = firstInterpolation.weight > lastInterpolation.weight
    maximumValue = Math.max(statDisplay.maximumValue, firstInterpolation.weight, lastInterpolation.weight)
    bar = !statDisplay.displayAsNumeric
    value = interpolateStatValue(value, statDisplay)
  }

  const displayType = isMs
    ? 'ms'
    : bar
      ? 'bar'
      : 'none'

  return {
    investmentValue: itemStat.value || 0,
    hash,
    name: statDef.displayProperties.name,
    sort: STAT_ORDER.indexOf(hash),
    value,
    base: value,
    maximumValue,
    displayType,
    smallerIsBetter,
    isConditionallyActive: itemStat.isConditionallyActive,
  }
}

export function getStatGroupEntryForItem(item: PrunedDestinyInventoryItemDefinition, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) {
  const statHash = item.stats?.statGroupHash
  if (!statHash) { return }

  return statGroups[statHash]
}

/**
 * @source https://github.com/DestinyItemManager/DIM/blob/master/src/app/inventory/store/stats.ts
 * Some weapon stats have an item-specific interpolation table, which is defined as
 * a piecewise linear function mapping input stat values to output stat values.
 */
export function interpolateStatValue(value: number, statDisplay: DestinyStatDisplayDefinition) {
  const interpolation = statDisplay.displayInterpolation

  // Prevent overfilling
  value = Math.min(value, statDisplay.maximumValue)

  let endIndex = interpolation.findIndex(p => p.value > value)

  // value < 0 is for mods with negative stats
  if (endIndex < 0) {
    endIndex = interpolation.length - 1
  }
  const startIndex = Math.max(0, endIndex - 1)

  const start = interpolation[startIndex]
  const end = interpolation[endIndex]
  const range = end.value - start.value
  if (range === 0) {
    return start.weight
  }

  const t = (value - start.value) / (end.value - start.value)

  const interpolationValue = start.weight + t * (end.weight - start.weight)

  // https://github.com/Bungie-net/api/issues/1029#issuecomment-531849137
  return statDisplay.statHash === STAT_MAPPING.MAGAZINE
    ? Math.round(interpolationValue)
    : bankersRound(interpolationValue)
}

/**
 * "Banker's rounding" rounds numbers that perfectly fall halfway between two integers to the nearest
 * even integer, instead of always rounding up.
 * @source https://github.com/DestinyItemManager/DIM/blob/master/src/app/inventory/store/stats.ts
 */
function bankersRound(x: number) {
  const r = Math.round(x)
  return (x > 0 ? x : -x) % 1 === 0.5
    ? (r % 2 === 0 ? r : r - 1)
    : r
}
