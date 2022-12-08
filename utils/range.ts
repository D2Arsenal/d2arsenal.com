import { DestinyItemSubType, TierType } from 'bungie-api-ts/destiny2'
import type { TransformedPerk } from './perks'
import type { FormattedStat } from './stats.js'
import { STAT_MAPPING } from './stats.js'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny'

const f = {
  '9': {
    zoomRangeMultiplier: 1.375,
    zoomTier: 14,
    vpp: { hip: 0.0864, ads: 0.132 },
    baseHip: { min: 16.96, max: 29.6 },
    baseAds: { min: 22, max: 40.7 },
    maxRangeVPP: { hip: 0.035, ads: 0.048 },
  },
  '9X': {
    zoomRangeMultiplier: 1.375,
    zoomTier: 14,
    vpp: { hip: 0.1035, ads: 0.158 },
    baseHip: { min: 21.95, max: 34.1 },
    baseAds: { min: 28.6, max: 46.89 },
    maxRangeVPP: { hip: 0.045, ads: 0.062 },
  },
  '6': {
    zoomRangeMultiplier: 1.575,
    zoomTier: 16,
    vpp: { hip: 0.0963, ads: 0.169 },
    baseHip: { min: 11.87, max: 40.8 },
    baseAds: { min: 15.83, max: 64.62 },
    maxRangeVPP: { hip: 0, ads: 0 },
  },
  '13': {
    zoomRangeMultiplier: 1.675,
    zoomTier: 17,
    vpp: { hip: 0.072, ads: 0.134 },
    baseHip: { min: 17.3, max: 40.4 },
    baseAds: { min: 25.8, max: 67.67 },
    maxRangeVPP: { hip: 0, ads: 0 },
  },
  '14': {
    zoomRangeMultiplier: 1.975,
    zoomTier: 20,
    vpp: { hip: 0.1521, ads: 0.334 },
    baseHip: { min: 30.89, max: 60.8 },
    baseAds: { min: 57.67, max: 120.08 },
    maxRangeVPP: { hip: 0, ads: 0 },
  },
  '24': {
    zoomRangeMultiplier: 1.275,
    zoomTier: 13,
    vpp: { hip: 0.0891, ads: 0.161 },
    baseHip: { min: 8.83, max: 24.5 },
    baseAds: { min: 6.12, max: 31.24 },
    maxRangeVPP: { hip: 0, ads: 0 },
  },
  '17': {
    zoomRangeMultiplier: 1.175,
    zoomTier: 12,
    vpp: { hip: 0.0306, ads: 0.04 },
    baseHip: { min: 11.94, max: 22.5 },
    baseAds: { min: 13.63, max: 26.44 },
    maxRangeVPP: { hip: 0.034, ads: 0.04 },
  },
  '11': {
    zoomRangeMultiplier: 1.3,
    zoomTier: 15,
    vpp: { hip: 0.0324, ads: 0.047 },
    baseHip: { min: 10.56, max: 15.1 },
    baseAds: { min: 13.26, max: 19.63 },
    maxRangeVPP: { hip: 0, ads: 0 },
  },
}
const d = [8, 10, 12, 18, 22, 23, 31, 33]

// isBaseStat - no perks, no new stats
export type RawRange = number | {
  hip: number
  hipSR: number
  ads: number
  adsRF: number
  hasRangefinder: boolean
  hasSeraph: boolean
}
export function calculateRange(perks: TransformedPerk[], stats: FormattedStat[], itemDef: PrunedDestinyInventoryItemDefinition, isBaseStat = false): RawRange | false {
  const h = itemDef.itemSubType
  if (d.includes(h)) {
    return false
  }
  const v = stats.find((e) => {
    return e.hash === STAT_MAPPING.RANGE
  })?.[isBaseStat ? 'value' : 'augmentedValue'] ?? 0
  const y = stats.find((e) => {
    return e.hash === STAT_MAPPING.ZOOM
  })?.[isBaseStat ? 'value' : 'augmentedValue'] ?? 0
  const [w] = itemDef.sockets?.socketEntries.filter(e => e.socketTypeHash === 3956125808) ?? []

  const M
    = w.singleInitialItemHash === 2757685314
      ? '9X'
      : itemDef.itemSubType
  const x = isBaseStat ? false : Object.values(perks).some(e => [2846385770, 509594246].includes(e.hash))
  const T = isBaseStat ? false : Object.values(perks).some(e => [1140096971].includes(e.hash))
  if (itemDef.tierType === TierType.Exotic) {
    return false
  }

  if (h === DestinyItemSubType.Shotgun) {
    if ([3956125808, 918679156].includes(w.singleInitialItemHash)) {
      return false
    }

    const I = Object.values(perks).some(e => [3161816588, 191144788].includes(e.hash))
      ? 20
      : 0
    const j = Object.values(perks).some(e => [47981717, 1370847713].includes(e.hash))
      ? 25
      : 0
    const O = v + I + Math.max(j, 100)
    return Math.round(100 * (0.036 * O + 3.4 + Number.EPSILON)) / 100
  }
  if (h === DestinyItemSubType.FusionRifle) {
    const N = 0.0324 * v + 10.56
    const L = 0.02 * y + 1
    const k = N * L
    return {
      hip: Math.round(100 * (N + Number.EPSILON)) / 100,
      hipSR: Math.round(100 * (1.1 * N + Number.EPSILON)) / 100,
      ads: Math.round(100 * (k + Number.EPSILON)) / 100,
      adsRF: Math.round(100 * (1.1 * k + Number.EPSILON)) / 100,
      hasRangefinder: x,
      hasSeraph: T,
    }
  }
  if (h === DestinyItemSubType.TraceRifle) {
    const D = 0.09 * v + 16
    const S = 0.1 * y - 0.025
    const C = D * S
    return {
      hip: Math.round(100 * (D + Number.EPSILON)) / 100,
      hipSR: Math.round(100 * (1.1 * D + Number.EPSILON)) / 100,
      ads: Math.round(100 * (C + Number.EPSILON)) / 100,
      adsRF: Math.round(100 * (1.1 * C + Number.EPSILON)) / 100,
      hasRangefinder: x,
      hasSeraph: T,
    }
  }
  if (M === '9X') {
    const A = 0.1 * y - 0.025
    const R = 20 + 0.09 * v
    const P = R * A
    return {
      hip: Math.round(100 * (R + Number.EPSILON)) / 100,
      hipSR: Math.round(100 * (1.1 * R + Number.EPSILON)) / 100,
      ads: Math.round(100 * (P + Number.EPSILON)) / 100,
      adsRF: Math.round(100 * (1.1 * P + Number.EPSILON)) / 100,
      hasRangefinder: x,
      hasSeraph: T,
    }
  }
  // @ts-expect-error later
  const H = f[M]
  const z = 0.1 * y - 0.025
  const E = H.baseHip.min + H.vpp.hip * v
  const _ = E * z
  return {
    hip: Math.round(100 * (E + Number.EPSILON)) / 100,
    hipSR: Math.round(100 * (1.1 * E + Number.EPSILON)) / 100,
    ads: Math.round(100 * (_ + Number.EPSILON)) / 100,
    adsRF: Math.round(100 * (1.1 * _ + Number.EPSILON)) / 100,
    hasRangefinder: x,
    hasSeraph: T,
  }
}
/*
function ttk() {
  const e
    = arguments.length > 0 && void 0 !== arguments[0]
      ? arguments[0]
      : null
  const t
    = arguments.length > 1 && void 0 !== arguments[1]
      ? arguments[1]
      : 1
  const o
    = arguments.length > 2 && void 0 !== arguments[2]
      ? arguments[2]
      : 200
  const l
    = arguments.length > 3 && void 0 !== arguments[3]
      ? arguments[3]
      : 1
  const c
    = arguments.length > 4 && void 0 !== arguments[4]
      ? arguments[4]
      : 1
  const f = e || n.store.getters['weapon/itemDef']
  if (!f) { return !1 }
  if (f.inventory.tierType === 6) { return !1 }
  if (f.itemSubType !== 9) { return !1 }
  const d = f.sockets.socketCategories.find((s) => {
    return s.socketCategoryHash === 3956125808
  })
  const h = f.sockets.socketEntries.find((e, t) => {
    return d.socketIndexes.includes(t)
  })
  const m = h == null ? void 0 : h.singleInitialItemHash
  if (!m) { return !1 }
  const v = Object.values(r.weapon_frames).find((e) => {
    return !!e.frameHashes.includes(m)
  })
  if (!v) { return !1 }
  const y = v.baseDamage.crit * (t * l * c)
  const w = v.baseDamage.body * (t * l * c)
  const M = Math.ceil(o / y)
  const x = Math.ceil(o / w)
  const T = Math.floor((Math.ceil(o / y) * y - o) / (y - w))
  const I = M - T
  const j = (M - 1) * v.bursts.seconds
  const O = (x - 1) * v.bursts.seconds
  const N = Math.round(100 * (j + Number.EPSILON)) / 100
  const L = Math.round(100 * (O + Number.EPSILON)) / 100
  return {
    time: { crit: N, body: L },
    optimal: {
      crit: I,
      body: Math.round(v.baseDamage.body) * M >= o ? M : T,
    },
    body: x,
  }
}
*/
