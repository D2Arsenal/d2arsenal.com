import { joinURL } from 'ufo'
const HOST = 'https://bungie.net/'
export const useBungieUrl = (path: string) => {
  return joinURL(HOST, path)
}
