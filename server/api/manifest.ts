import { loadMinimalManifest } from "~/utils/server/manifest"
import pkg from '~/package.json'

export default defineCachedEventHandler(async (event) => {
  const manifest = await loadMinimalManifest()

  // Set ETag to improve caching
  setResponseHeader(event, 'ETag', manifest.version + pkg.version)

  return manifest
}, {
  maxAge: 0
})