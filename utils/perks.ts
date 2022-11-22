import type { DestinyItemSocketEntryPlugItemRandomizedDefinition, DestinyPlugSetDefinition, DestinyStatDefinition, DestinyStatGroupDefinition } from 'bungie-api-ts/destiny2'
import { getStatsForItem } from '~/utils/stats'
import { perks as perkInfo } from '~/utils/info'
import type { Stat } from '~/utils/stats'
import type { PrunedDestinyInventoryItemDefinition } from '~/types/destiny'
import type { DefinitionRecord } from '~/types'

export const PERK_NONE = 0
export const PERK_LENGTH = 6
export const COMMON_PERK_LENGTH = 4
export const PERK_INTRINSIC_COLUMN = 0
export const CANNOT_ROLL_PERK_WARNING = 'This perk currently cannot roll on this weapon'

export interface Perk {
  hash: number
  isIntrinsic: boolean
  currentlyCanRoll: boolean
  craftingLevel?: number
  trait?: PrunedDestinyInventoryItemDefinition
  enhancedTrait?: PrunedDestinyInventoryItemDefinition
  subDescription?: string
  enhancedSubDescription?: string
  stats: Stat[]
  enhancedStats?: Stat[]
}

export type TransformedPerk = Omit<Perk, 'enhancedTrait'> & {
  isEnhanced: boolean
  hasEnhanced: boolean
  enhancedTrait: undefined
}

const enrichPerkWithGivenTraitFactory = (stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) => (hash: number, trait: PrunedDestinyInventoryItemDefinition) => ({
  trait,
  subDescription: perkInfo[trait.hash]?.description,
  stats: getStatsForItem(stats, trait, statGroups) ?? [],
})

const lookupTraitForPerkFactory = (traits: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>) => (hash: number) => {
  const trait = traits.find(t => t.hash === hash)
  if (!trait) {
    return {
      trait: undefined,
      stats: [],
      subDescription: undefined,
    }
  }
  return enrichPerkWithGivenTraitFactory(stats, statGroups)(hash, trait)
}

export function buildPerks(weapon: PrunedDestinyInventoryItemDefinition, plugSets: DefinitionRecord<DestinyPlugSetDefinition>, traits: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>, frame?: PrunedDestinyInventoryItemDefinition) {
  const { curatedPerks, perks } = resolvePerks(weapon, plugSets, traits, stats, statGroups, frame)
  // TODO: Get craftable catalysts, see e.g. Ostea Striga
  // https://www.light.gg/db/items/46524085/osteo-striga/
  // https://d2gunsmith.com/w/46524085?s=0,0,4015745376,990298390,0,0
  const filteredPerks = perks.map(col => col.filter(p => p.hash && p.trait)).filter(c => c.length > 0)
  return {
    curatedPerks: curatedPerks.filter(c => c.length > 0),
    perks: filteredPerks,
  }
}

function resolvePerks(weapon: PrunedDestinyInventoryItemDefinition, plugSets: DefinitionRecord<DestinyPlugSetDefinition>, traits: PrunedDestinyInventoryItemDefinition[], stats: DefinitionRecord<DestinyStatDefinition>, statGroups: DefinitionRecord<DestinyStatGroupDefinition>, frame?: PrunedDestinyInventoryItemDefinition) {
  const lookupTraitForPerk = lookupTraitForPerkFactory(traits, stats, statGroups)
  const enrichPerkWithGivenTrait = enrichPerkWithGivenTraitFactory(stats, statGroups)

  // TODO: Revisit and refactor

  const n = weapon.sockets?.socketEntries
  const perks: Perk[][] = [[], [], [], [], [], []]
  const curatedPerks: Perk[][] = [[], [], [], [], [], []]
  const f = weapon.sockets?.socketCategories.find(s => s.socketCategoryHash === 3956125808)
  const d = weapon.sockets?.socketCategories.find(s => s.socketCategoryHash === 4241085061)

  if (frame) {
    perks[0].push({
      hash: frame.hash,
      isIntrinsic: true,
      currentlyCanRoll: true,
      trait: frame,
      stats: [],
    })
  }

  // TODO: Is this line correct?
  const h = n?.find(e => Boolean(f?.socketIndexes.includes(e.singleInitialItemHash)))

  if (h && h.singleInitialItemHash !== 0) {
    perks[0].push({
      hash: h.singleInitialItemHash,
      isIntrinsic: true,
      currentlyCanRoll: true,
      ...lookupTraitForPerk(h.singleInitialItemHash),
    })
  }
  const m = n?.filter((e, n) => {
    if (e.socketTypeHash === 3993098925) {
      const hash = e?.reusablePlugSetHash ?? e?.randomizedPlugSetHash
      if (hash) {
        const c = plugSets[hash]?.reusablePlugItems
        perks[5] = c.map(p => ({
          hash: p.plugItemHash,
          isIntrinsic: false,
          currentlyCanRoll: p.currentlyCanRoll,
          ...lookupTraitForPerk(p.plugItemHash),
        }))
        // TODO: Return false correct here?
        return false
      }
    }

    if (weapon.hash === 1744115122) {
      return false
    }

    const m = d?.socketIndexes?.includes(n)
    const v = e.preventInitializationOnVendorPurchase || e.singleInitialItemHash === 2285418970
    return m && !v
  })
  const v = m?.some(e => 'randomizedPlugSetHash' in e)
  // TODO: Refactor!
  if (!v) {
    m?.forEach((socketEntry, index) => {
      if (!socketEntry?.reusablePlugSetHash) {
        return
      }

      const c = plugSets[socketEntry.reusablePlugSetHash]
      const r: Perk[] = c.reusablePlugItems.map(e => ({
        hash: e.plugItemHash,
        isIntrinsic: false,
        currentlyCanRoll: true,
        ...lookupTraitForPerk(e.plugItemHash),
      }))

      perks[index + 1].push(...r)
    })
    return { curatedPerks, perks }
  }

  // Setup curated perks
  // TODO: Always add origin traits
  // TODO: Find a nicer way for this!
  m?.forEach((socketEntry, index) => {
    const r: Perk[] = socketEntry.reusablePlugItems.map(e => ({
      hash: e.plugItemHash,
      isIntrinsic: false,
      currentlyCanRoll: true,
      ...lookupTraitForPerk(e.plugItemHash),
    }))
    curatedPerks[index + 1].push(...r)
  })

  m?.forEach((socketEntry, index) => {
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

    const e = (p: DestinyItemSocketEntryPlugItemRandomizedDefinition) => f.some(e => e.plugItemHash === p.plugItemHash)
    const t = (p: DestinyItemSocketEntryPlugItemRandomizedDefinition) => d.some(e => e.plugItemHash === p.plugItemHash)
    const plugEntries = h
      .filter(p => !(e(p) && t(p) && !p.currentlyCanRoll) && p)
      .filter((entry, index, array) => (
        // Dedupe
        array.findIndex(t => (
          t.plugItemHash === entry.plugItemHash
          && t.currentlyCanRoll === entry.currentlyCanRoll
        )) === index
      ))

    const enhancedTraitPlugEntries = plugEntries.filter((e) => {
      const trait = traits.find(t => t.hash === e.plugItemHash)
      return trait?.itemTypeDisplayName === 'Enhanced Trait'
    })

    const nonEnhancedTraitPlugEntries = plugEntries.filter((e) => {
      const trait = traits.find(t => t.hash === e.plugItemHash)
      return trait?.itemTypeDisplayName !== 'Enhanced Trait'
    })

    perks[index + 1] = nonEnhancedTraitPlugEntries.map((nonEnhancedTraitEntry) => {
      const normalTrait = traits.find(e => e.hash === nonEnhancedTraitEntry.plugItemHash)

      let possibleEnhancedTrait: PrunedDestinyInventoryItemDefinition | undefined
      for (const enhancedTraitEntry of enhancedTraitPlugEntries) {
        const _possibleEnhancedTrait = traits.find(t => t.hash === enhancedTraitEntry.plugItemHash)
        const rName = normalTrait?.displayProperties.name
        const oName = _possibleEnhancedTrait?.displayProperties.name
        if (rName === oName?.replace(' Enhanced', '')) {
          possibleEnhancedTrait = _possibleEnhancedTrait
        }
      }

      const hash = nonEnhancedTraitEntry.plugItemHash

      const traitInfo = normalTrait ? enrichPerkWithGivenTrait(hash, normalTrait) : lookupTraitForPerk(hash)
      const { stats: enhancedStats, subDescription: enhancedSubDescription } = (possibleEnhancedTrait && enrichPerkWithGivenTrait(hash, possibleEnhancedTrait)) || {}

      return {
        hash,
        isCurated: false,
        curatedOnly: false,
        isIntrinsic: false,
        currentlyCanRoll: nonEnhancedTraitEntry.currentlyCanRoll,
        craftingLevel: nonEnhancedTraitEntry?.craftingRequirements?.requiredLevel,
        enhancedTrait: possibleEnhancedTrait,
        ...traitInfo,
        enhancedStats,
        enhancedSubDescription,
      }
    })
  })

  return { curatedPerks, perks }
}

export const getHashesFromPerk = (perk: Perk) => {
  const hash = perk.trait?.hash
  const enhancedHash = perk.enhancedTrait?.hash
  return { hash, enhancedHash }
}

export const isPerkSelected = (perk: Perk, valueToCheck: unknown) => {
  const { hash, enhancedHash } = getHashesFromPerk(perk)
  if (valueToCheck === hash) {
    return true
  }

  if (!enhancedHash) {
    return false
  }

  return valueToCheck === enhancedHash
}

export const isEnhancedPerk = (perk: Perk, valueToCheck: unknown) => {
  const { enhancedHash } = getHashesFromPerk(perk)
  return Boolean(enhancedHash && valueToCheck === enhancedHash)
}

export const changePerkStatus = (perk: Perk, valueToCheck: unknown) => {
  const { hash, enhancedHash } = getHashesFromPerk(perk)
  const isHash = valueToCheck === hash
  if (isEnhancedPerk(perk, valueToCheck)) {
    return PERK_NONE
  }

  if (isHash) {
    return enhancedHash ?? PERK_NONE
  }

  return hash!
}

export const toTransformedPerks = (perks: Array<{ perk: Perk; isEnhanced: boolean } | null>) => perks.map((perkObj) => {
  if (!perkObj) {
    return null
  }

  const clonedObj: { perk: Perk; isEnhanced: boolean } = JSON.parse(JSON.stringify(perkObj))
  const newPerkObj: TransformedPerk = {
    ...clonedObj.perk,
    hasEnhanced: Boolean(clonedObj.perk.enhancedTrait),
    isEnhanced: clonedObj.isEnhanced,
    enhancedTrait: undefined,
  }

  // Override trait for enhanced perk
  if (clonedObj.isEnhanced) {
    newPerkObj.trait = clonedObj.perk.enhancedTrait
  }

  return newPerkObj
})
