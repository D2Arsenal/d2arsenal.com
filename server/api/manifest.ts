import { loadMinimalManifest } from "~/utils/server/manifest"

export default defineEventHandler(async (event) => {
  const manifest = await loadMinimalManifest()

  // Set ETag to improve caching
  setResponseHeader(event, 'ETag', manifest.version)

  return manifest
})