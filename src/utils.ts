import { isNil, curry, ap, path, mergeAll } from 'ramda'

export let getVar = (name: string): string => {
  const val = process.env[name]
  if (isNil(val)) {
    throw new Error(`process.env.${name} required`)
  }
  return val
}

export let prop = <T extends keyof V, V>(p: T) => (obj: V): V[T] | undefined => {
  if (obj[p] !== null) return obj[p]
}

let noop = {'@@functional/placeholder': true} as any

// $todo
let paths = curry((ps, obj) => ap([path(noop, obj) as any], ps as ReadonlyArray<{}>))
// temp fix for types :()

export let mergePaths = curry((ps, obj) => mergeAll(paths(ps, obj)))
