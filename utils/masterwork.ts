import { DestinyItemSubType, TierType } from 'bungie-api-ts/destiny2'
import type { DestinyStatDisplayDefinition } from 'bungie-api-ts/destiny2'
import type { PrunedDestinyInventoryItemDefinition, PrunedDestinyStatGroupDefinition, PrunedPlugSetDefinition } from '~/types/destiny'
import type { DefinitionRecord } from '~/types'

interface MasterworkData {
  benefits: PrunedDestinyInventoryItemDefinition[]
  hash: number
  active: boolean
  catalyst?: PrunedDestinyInventoryItemDefinition
}

export interface Masterwork {
  statistic: string
  data: MasterworkData
}

const MASTERWORK_BASE: Record<string, MasterworkData> = {
  stability: {
    benefits: [],
    hash: 155624089,
    active: false,
  },
  range: {
    benefits: [],
    hash: 1240592695,
    active: false,
  },
  handling: {
    benefits: [],
    hash: 943549884,
    active: false,
  },
  damage: {
    benefits: [],
    hash: 4043523819,
    active: false,
  },
  reload: {
    benefits: [],
    hash: 4188031367,
    active: false,
  },
  blast_radius: {
    benefits: [],
    hash: 3614673599,
    active: false,
  },
  projectile_speed: {
    benefits: [],
    hash: 2523465841,
    active: false,
  },
  charge_time: {
    benefits: [],
    hash: 2961396640,
    active: false,
  },
  draw_time: {
    benefits: [],
    hash: 447667954,
    active: false,
  },
  accuracy: {
    benefits: [],
    hash: 1591432999,
    active: false,
  },
  shield_duration: {
    benefits: [],
    hash: 1842278586,
    active: false,
  },
}

const createDefaultMasterwork = () => MASTERWORK_BASE

export function buildMasterwork(weapon: PrunedDestinyInventoryItemDefinition, statGroups: DefinitionRecord<PrunedDestinyStatGroupDefinition>, plugSets: DefinitionRecord<PrunedPlugSetDefinition>, catalysts: PrunedDestinyInventoryItemDefinition[]) {
  const socketEntries = weapon.sockets!.socketEntries
  const plugItems = plugSets[2326575037]?.reusablePlugItems
  const scaledStats = statGroups[weapon.stats!.statGroupHash!].scaledStats
  const isSuperior = weapon.inventory!.tierType === TierType.Superior
  const w = [4160547565, 4126105782, 3728733956, 2273483223]
  const masterwork = createDefaultMasterwork()
  Object.values(masterwork).forEach((mw) => {
    mw.catalyst = catalysts.find(c => c.hash === mw.hash)
    return mw
  })
  if (!isSuperior) {
    return
  }

  const socketCategory = weapon?.sockets?.socketCategories.find(e => e.socketCategoryHash === 2685412949)
  const socketIndexes = socketCategory?.socketIndexes ?? []
  const v = socketEntries
    .filter((_, t) => socketIndexes.includes(t))
    .some(e => w.find(s => s === e.singleInitialItemHash))

  plugItems?.forEach((e) => {
    const masterworkItem = catalysts.find(t => t.hash === e.plugItemHash)
    if (!masterworkItem) {
      return
    }

    const n = masterworkItem.plug!.plugCategoryIdentifier.split('.')
    const r = n[n.length - 1]
    masterwork[r].benefits.push(masterworkItem)
  })

  function d(weapon: PrunedDestinyInventoryItemDefinition, hash: number, stats: DestinyStatDisplayDefinition[]) {
    const firstCondition = hash !== 2961396640 || !weapon.itemCategoryHashes || !weapon.itemCategoryHashes.includes(3317538576)

    if (!firstCondition) {
      return false
    }

    const validForStatHash = [
      3614673599,
      2523465841,
      4043523819,
      1240592695,
      1591432999,
      155624089,
      943549884,
      4188031367,
      2837207746,
      2762071195,
      209426660,
      1345609583,
      3555269338,
      2715839340,
      4284893193,
      2961396640,
      447667954,
      3871231066,
      1931675084,
      925767036,
    ]

    const validInGeneral = [1345609583, 3555269338, 2715839340]

    const secondCondition = validForStatHash.includes(hash) && (stats.find(s => hash === s.statHash) || validInGeneral.includes(hash))

    return secondCondition
  }

  // TODO: Refactor
  Object.entries(masterwork).forEach(([key, value]) => {
    if (!d(weapon, value.hash, scaledStats)) {
      masterwork[key].active = false
      return
    }
    if (weapon.itemSubType !== DestinyItemSubType.Sword && key === 'damage') {
      masterwork[key].active = false
      return
    }
    masterwork[key].active = true
  })

  return {
    isYearOne: v,
    masterwork,
  }
}

export const masterworkStatisticToTerm = (statistic: string) => statistic
  .replaceAll('_', ' ')
  .replace('damage', 'impact')
  .replace('projectile speed', 'velocity')
