import { loadManifest } from '~/utils/server/manifest'
import pkg from '~/package.json'
import { getSuggestedWeapons } from '~/utils/weapon'

export default defineCachedEventHandler(async (event) => {
  const { data, version } = await loadManifest()
  const { weapons } = data

  setResponseHeader(event, 'ETag', version + pkg.version)

  return getSuggestedWeapons(weapons)
}, {
  maxAge: 0,
})
