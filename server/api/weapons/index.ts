import { loadManifest } from '~/utils/server/manifest';
import pkg from '~/package.json'

export default defineEventHandler(async (event) => {
  const { data, version } = await loadManifest()
  const { weapons } = data

  const minimalWeapons = weapons.map((weapon) => ({
    hash: weapon.hash,
    name: weapon.displayProperties.name,
    icon: weapon.displayProperties.icon,
    watermark: weapon.iconWatermark,
  }))

  setResponseHeader(event, 'ETag', version + pkg.version)

  return minimalWeapons
})