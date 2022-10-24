import { Masterwork } from './../../../utils/masterwork';
import { loadManifest } from '~/utils/server/manifest';
import { buildPerks } from '~/utils/perks';
import { buildMasterwork } from '~/utils/masterwork';


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  const { data } = await loadManifest()
  // TODO: Rewrite as object for easier lookup?
  const { weapons, weaponTraits, plugSets, statDefs, statGroups, frames, catalysts } = data

  const weapon = weapons.find(i => i.hash === id)
  if (!weapon) {
    return createError({ statusCode: 404, message: 'Weapon not found' })
  }

  const frameForWeapon = frames.find((f) => f.hash === weapon?.sockets?.socketEntries[0]?.singleInitialItemHash)

  // TODO: Check if "building" perks (adding stats and so on) makes more sense on the frontend and only selecting perks here
  const perks = buildPerks(weapon, plugSets, weaponTraits, statDefs, statGroups, frameForWeapon)

  // TODO: Remove undefined if possible!
  const { masterwork: rawMasterwork } = buildMasterwork(weapon, statGroups, plugSets, catalysts) ?? {}
  const masterwork: Masterwork[] = Object.entries(rawMasterwork ?? {})
    .filter(e => e[1].active)
    .map(([statistic, data]) => ({
      statistic,
      data
    }))

  return { weapon, perks, masterwork }
})