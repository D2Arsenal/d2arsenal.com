import { getStatsForItem } from '~/utils/stats';
import { perks as perkInfo } from '~/utils/info';
import type { Stat } from '~/utils/stats';
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny';
import type { DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyPlugSetDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from "bungie-api-ts/destiny2"
import type { DefinitionRecord } from "~/types"

export const PERK_NONE = 0
export const PERK_LENGTH = 6
export const COMMON_PERK_LENGTH = 4
export const PERK_INTRINSIC_COLUMN = 0
export const CANNOT_ROLL_PERK_WARNING = 'This perk currently cannot roll on this weapon'

export type Perk = {
  hash: number,
  isCurated: boolean,
  curatedOnly: boolean,
  isIntrinsic: boolean,
  currentlyCanRoll: boolean,
  hasEnhanced?: boolean,
  craftingLevel?: number,
  trait?: PrunedDestinyInventoryItemDefinition,
  subDescription?: string,
  stats: Stat[]
}

const lookupTraitForPerkFactory = (traits: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) => (hash: number) => {
  const trait = traits.find(((t) => t.hash === hash));
  if (!trait) {
    return {
      trait: undefined,
      stats: [],
      subDescription: undefined
    };
  }

  return {
    trait,
    subDescription: perkInfo[trait.hash]?.description,
    stats: getStatsForItem(stats, trait, statGroups) ?? []
  };
}

export function buildPerks (weapon: PrunedDestinyInventoryItemDefinition, plugSets: DefinitionRecord<DestinyPlugSetDefinition>, traits: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>, frame?: PrunedDestinyInventoryItemDefinition, isCurated: boolean = false) {
  const columns = resolvePerks(weapon, plugSets, traits, stats, statGroups, frame, isCurated)
  return columns.filter(c => c.length > 0)
}

function resolvePerks (weapon: PrunedDestinyInventoryItemDefinition, plugSets: DefinitionRecord<DestinyPlugSetDefinition>, traits: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>, frame?: PrunedDestinyInventoryItemDefinition, isCurated: boolean = false) {
  const lookupTraitForPerk = lookupTraitForPerkFactory(traits, stats, statGroups)

  // TODO: Revisit and refactor

  const n = weapon.sockets?.socketEntries
  const perks: Perk[][] = [[], [], [], [], [], []]
  const f = weapon.sockets?.socketCategories.find((s) => 3956125808 === s.socketCategoryHash)
  const d = weapon.sockets?.socketCategories.find((s) => 4241085061 === s.socketCategoryHash)

  if (frame) {
    perks[0].push({
      hash: frame.hash,
      isCurated: false,
      curatedOnly: false,
      isIntrinsic: true,
      currentlyCanRoll: true,
      trait: frame,
      stats: []
    })
  }

  // TODO: Is this line correct?
  const h = n?.find((e) => Boolean(f?.socketIndexes.includes(e.singleInitialItemHash)))

  if (h && h.singleInitialItemHash !== 0) {
    perks[0].push({
      hash: h.singleInitialItemHash,
      isCurated: false,
      curatedOnly: false,
      isIntrinsic: true,
      currentlyCanRoll: true,
      ...lookupTraitForPerk(h.singleInitialItemHash)
    })
  }
  const m = n?.filter(function (e, n) {
    if (e.socketTypeHash === 3993098925) {
      const hash = e?.reusablePlugSetHash ?? e?.randomizedPlugSetHash
      if (hash) {
        const c = plugSets[hash]?.reusablePlugItems
        perks[5] = c.map((p) => ({
          hash: p.plugItemHash,
          isCurated: false,
          curatedOnly: false,
          isIntrinsic: false,
          currentlyCanRoll: p.currentlyCanRoll,
          hasEnhanced: false,
          ...lookupTraitForPerk(p.plugItemHash)
        }))
        return
      }
    }

    if (weapon.hash === 1744115122) {
      return false
    }

    const m = d?.socketIndexes.includes(n)
    const v = e.preventInitializationOnVendorPurchase || e.singleInitialItemHash === 2285418970
    return m && !v
  })
  const v = m?.some((e) => "randomizedPlugSetHash" in e)
  // TODO: Refactor!
  if (!v) {
    m?.forEach((socketEntry, index) => {
      if (!socketEntry?.reusablePlugSetHash) {
        return
      }
      const c = plugSets[socketEntry.reusablePlugSetHash]
      const r: Perk[] = c.reusablePlugItems.map((e) => ({
        hash: e.plugItemHash,
        isCurated: false,
        curatedOnly: false,
        isIntrinsic: false,
        currentlyCanRoll: true,
        ...lookupTraitForPerk(e.plugItemHash)
      }))

      perks[index + 1].push(...r)
    })
    return perks
  }

  if (isCurated) {
    m?.forEach((socketEntry, index) => {
      const r: Perk[] = socketEntry.reusablePlugItems.map((e) => ({
        hash: e.plugItemHash,
        isCurated: false,
        curatedOnly: false,
        isIntrinsic: false,
        currentlyCanRoll: true,
        ...lookupTraitForPerk(e.plugItemHash)
      }))
      perks[index + 1].push(...r)
    })
    return perks
  }
  m?.forEach(function (socketEntry, index) {
    const plugSetHash = socketEntry?.randomizedPlugSetHash ?? socketEntry.reusablePlugSetHash ?? -1
    const plug = plugSets[plugSetHash].reusablePlugItems
    const h = plug

    const canRoll: DestinyItemSocketEntryPlugItemRandomizedDefinition[] = []
    const f = canRoll
    const cannotRoll: DestinyItemSocketEntryPlugItemRandomizedDefinition[] = []
    const d = cannotRoll
    h.forEach((p) => {
      const toPush = p.currentlyCanRoll ? canRoll : cannotRoll
      toPush.push(p)
    })


    const e = (p: DestinyItemSocketEntryPlugItemRandomizedDefinition) => f.some((e) => e.plugItemHash === p.plugItemHash)
    const t = (p: DestinyItemSocketEntryPlugItemRandomizedDefinition) => d.some((e) => e.plugItemHash === p.plugItemHash)
    let m = h.filter((p) => {
      return !(e(p) && t(p) && !p.currentlyCanRoll) && p
    }).filter((entry, index, array) => (
      // Dedupe
      array.findIndex((t) => (
        t.plugItemHash === entry.plugItemHash &&
        t.currentlyCanRoll === entry.currentlyCanRoll
      )) === index
    ))

    const v = m.filter((e) => {
      const trait = traits.find((t) => t.hash === e.plugItemHash)
      return trait?.itemTypeDisplayName === "Enhanced Trait"
    });

    perks[index + 1] = m
      .filter((e) => {
        const trait = traits.find((t) => t.hash === e.plugItemHash)
        return trait?.itemTypeDisplayName !== "Enhanced Trait"
      })
      .map(function (p) {
        const hasEnhanced = v.find((e) => {
          const r = traits.find((e) => e.hash === p.plugItemHash)?.displayProperties.name
          const o = traits.find((t) => t.hash === e.plugItemHash)?.displayProperties.name
          return o?.includes(" Enhanced")
            ? r === o.replace(" Enhanced", "")
            : r === o
        })
        return {
          hash: p.plugItemHash,
          isCurated: false,
          curatedOnly: false,
          isIntrinsic: false,
          currentlyCanRoll: p.currentlyCanRoll,
          craftingLevel: p?.craftingRequirements?.requiredLevel,
          hasEnhanced: Boolean(hasEnhanced),
          ...lookupTraitForPerk(p.plugItemHash)
        }
      })
  })

  return perks
}
