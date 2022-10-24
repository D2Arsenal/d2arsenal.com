import { loadManifest } from '~/utils/server/manifest';

export default defineEventHandler(async (event) => {
  const { data } = await loadManifest()
  const { weapons } = data

  const minimalWeapons = weapons.map((weapon) => ({
    hash: weapon.hash,
    name: weapon.displayProperties.name,
    icon: weapon.displayProperties.icon,
    watermark: weapon.iconWatermark,
  }))

  return minimalWeapons
})