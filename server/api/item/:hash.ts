import { loadManifest } from "~/utils/server/manifest"

export default defineEventHandler(async (event) => {
  const hash = event.context.params.hash as number

  const { data } = await loadManifest()

  const res = Object.values(data).find((defArrOrObj) => {
    if (Array.isArray(defArrOrObj)) {
      const possibleMatch = defArrOrObj.find(i => i.hash === hash)
      if (possibleMatch) {
        console.log('Found as arr match', possibleMatch)
        return possibleMatch
      }
    }
    if (typeof defArrOrObj === "object") {
      if (defArrOrObj?.[hash]) {
        console.log('Found as obj match', defArrOrObj[hash])
        return defArrOrObj[hash]
      }
    }
  }) ?? 'NOT FOUND'
  // @ts-ignore - Why is that?!?
  return res[hash] ?? res
})