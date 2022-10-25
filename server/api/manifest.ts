import { loadMinimalManifest } from "~/utils/server/manifest"
import pkg from '~/package.json'

export default defineEventHandler(async (event) => {
  const manifest = await loadMinimalManifest()

  // Set ETag to improve caching
  setResponseHeader(event, 'ETag', manifest.version + pkg.version)

  return manifest
})