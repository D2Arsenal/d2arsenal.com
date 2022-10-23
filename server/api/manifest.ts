import { loadManifest } from "~/utils/server/manifest"

export default defineEventHandler(async (event) => {
  const manifest = await loadManifest()

  // Set ETag to improve caching
  setResponseHeader(event, 'ETag', manifest.version)

  return manifest
})