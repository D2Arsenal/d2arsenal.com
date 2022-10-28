import { loadManifest } from '~/utils/server/manifest';
import pkg from '~/package.json'
import { getMinimalWeapons } from '~/utils/weapon';

export default defineCachedEventHandler(async (event) => {
  const { data, version } = await loadManifest()
  const { weapons } = data

  const minimalWeapons = getMinimalWeapons(weapons)

  setResponseHeader(event, 'ETag', version + pkg.version)

  return minimalWeapons
}, {
  maxAge: 0
})