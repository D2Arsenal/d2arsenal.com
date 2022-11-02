/// <reference types="vue/macros-global" />

declare global {
  var __timing__: {
    logStart: (id: string) => void
    logEnd: (id: string) => void
  }
}

export { }