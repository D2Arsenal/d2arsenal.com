import { loadManifest } from '~/utils/server/manifest'
import { buildPerks } from '~/utils/perks'
import { buildMasterwork } from '~/utils/masterwork'
import type { Masterwork } from '~/utils/masterwork'
import pkg from '~/package.json'

export default defineCachedEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  if (!id) {
    return createError({
      statusCode: 404,
      message: 'Please provide a weapon hash',
    })
  }

  const { data, version } = await loadManifest()

  // TODO: Rewrite as object for easier lookup?
  const { weapons, weaponTraits, plugSets, statDefs, statGroups, frames, catalysts } = data

  const weapon = weapons.find(i => i.hash === id)
  if (!weapon) {
    return createError({
      statusCode: 404,
      message: 'Sorry, the provided weapon hash is invalid and could not be found',
    })
  }

  const frameForWeapon = frames.find(f => f.hash === weapon?.sockets?.socketEntries[0]?.singleInitialItemHash)
  // TODO: Check if "building" perks (adding stats and so on) makes more sense on the frontend and only selecting perks here
  const perks = buildPerks(weapon, plugSets, weaponTraits, statDefs, statGroups, frameForWeapon)

  // TODO: Remove undefined if possible!
  const { masterwork: rawMasterwork } = buildMasterwork(weapon, statGroups, plugSets, catalysts) ?? {}
  const masterwork: Masterwork[] = Object.entries(rawMasterwork ?? {})
    .filter(e => e[1].active)
    .map(([statistic, data]) => ({
      statistic,
      data,
    }))

  setResponseHeader(event, 'ETag', version + pkg.version)

  return { weapon, perks, masterwork }
}, {
  maxAge: 0,
})
