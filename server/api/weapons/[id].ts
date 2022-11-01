import { loadManifest } from '~/utils/server/manifest';
import { buildPerks } from '~/utils/perks';
import { buildMasterwork } from '~/utils/masterwork';
import type { Masterwork } from '~/utils/masterwork';
import pkg from '~/package.json'

export default defineCachedEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  globalThis.__timing__.logStart('loadManifest')
  const { data, version } = await loadManifest()
  globalThis.__timing__.logEnd('loadManifest')

  // TODO: Rewrite as object for easier lookup?
  const { weapons, weaponTraits, plugSets, statDefs, statGroups, frames, catalysts } = data

  globalThis.__timing__.logStart('findWeapon')
  const weapon = weapons.find(i => i.hash === id)
  globalThis.__timing__.logEnd('findWeapon')
  if (!weapon) {
    return createError({ statusCode: 404, message: 'Weapon not found' })
  }

  globalThis.__timing__.logStart('findFrame')
  const frameForWeapon = frames.find((f) => f.hash === weapon?.sockets?.socketEntries[0]?.singleInitialItemHash)
  globalThis.__timing__.logEnd('findFrame')

  globalThis.__timing__.logStart('buildPerks')
  // TODO: Check if "building" perks (adding stats and so on) makes more sense on the frontend and only selecting perks here
  const perks = buildPerks(weapon, plugSets, weaponTraits, statDefs, statGroups, frameForWeapon)
  globalThis.__timing__.logEnd('buildPerks')

  globalThis.__timing__.logStart('buildMasterwork')
  // TODO: Remove undefined if possible!
  const { masterwork: rawMasterwork } = buildMasterwork(weapon, statGroups, plugSets, catalysts) ?? {}
  const masterwork: Masterwork[] = Object.entries(rawMasterwork ?? {})
    .filter(e => e[1].active)
    .map(([statistic, data]) => ({
      statistic,
      data
    }))

  globalThis.__timing__.logEnd('buildMasterwork')

  setResponseHeader(event, 'ETag', version + pkg.version)

  return { weapon, perks, masterwork }
}, {
  maxAge: 0
})