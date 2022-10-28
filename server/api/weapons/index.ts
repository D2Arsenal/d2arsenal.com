import { loadManifest } from '~/utils/server/manifest';
import pkg from '~/package.json'
import { getMinimalWeapons } from '~/utils/weapon';

export default defineEventHandler(async (event) => {
  const version = useRuntimeConfig().public.manifestVersion
  const { data } = await loadManifest(version)
  const { weapons } = data

  const minimalWeapons = getMinimalWeapons(weapons)

  setResponseHeader(event, 'ETag', version + pkg.version)

  return minimalWeapons
})