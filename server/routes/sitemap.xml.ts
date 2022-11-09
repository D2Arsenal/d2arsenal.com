import { joinURL } from 'ufo';
import { $fetch } from 'ohmyfetch'
import { SitemapStream, streamToPromise } from 'sitemap'
import type { MinimalWeapon } from '~/utils/weapon';

const config = useRuntimeConfig()
const SITE_URL = config.public.siteUrl

const BASE_URLS = ['/', '/donate/']

export default defineCachedEventHandler(async (event) => {
  const minimalWeapons = await $fetch<MinimalWeapon[]>(joinURL(SITE_URL, '/api/weapons'))
  const urls = BASE_URLS.concat(minimalWeapons.map(w => `/en/weapons/${w.hash}/`))

  const sitemap = new SitemapStream({
    hostname: SITE_URL
  })

  urls.forEach(url => {
    sitemap.write({
      url,
      changefreq: 'weekly'
    })
  })
  sitemap.end()

  setHeader(event, 'content-type', 'application/xml')

  return streamToPromise(sitemap)
}, { maxAge: 0 })
