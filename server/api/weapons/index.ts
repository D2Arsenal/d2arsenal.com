import { loadManifest } from '~/utils/server/manifest'
import pkg from '~/package.json'
import { getMinimalWeapons, getSuggestedWeapons } from '~/utils/weapon'

export default defineCachedEventHandler(async (event) => {
  const { data, version } = await loadManifest()
  const { weapons } = data

  const { suggested } = useQuery(event)
  const shouldProvideSuggestedWeapons = suggested === 'true'
  setResponseHeader(event, 'ETag', version + pkg.version + (shouldProvideSuggestedWeapons ? 's' : ''))

  if (shouldProvideSuggestedWeapons) {
    return getSuggestedWeapons(weapons)
  }

  return getMinimalWeapons(weapons)
}, {
  maxAge: 0,
})
