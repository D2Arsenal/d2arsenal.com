import { loadManifest } from '~/utils/server/manifest';
import { buildPerks } from '~/utils/perks';
import { isWeaponTrait, isWeaponFrame } from '~/utils/checks';


export default defineEventHandler(async (event) => {
  const id = Number(event.context.params.id)
  const { data } = await loadManifest()
  const { weapons, weaponTraits, plugSets, statDefs, statGroups, frames } = data

  const weapon = weapons.find(i => i.hash === id)
  if (!weapon) {
    return createError({ statusCode: 404, message: 'Weapon not found' })
  }

  const frameForWeapon = frames.find((f) => f.hash === weapon?.sockets?.socketEntries[0]?.singleInitialItemHash)

  const perks = buildPerks(weapon, plugSets, weaponTraits, statDefs, statGroups, frameForWeapon)

  return { weapon, perks }
})