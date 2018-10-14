import { interval, Observable, from, of } from 'rxjs'
import { switchMap, map as RxMap, startWith, catchError } from 'rxjs/operators'
import axios, { AxiosResponse } from 'axios'
import { getVar, mergePaths } from '../utils'
import { compose, map as Rmap, values, pickAll} from 'ramda'

interface CryptoObject {
  name: string
  symbol: string
  price: number
  percent_change_1h: number
}

/**
 * Convert axios request to observable
 * @param  {} params
 */
let request = (params?: {}): Observable<AxiosResponse> => {
  const cmcToken = getVar('CMCTOKEN')

  return from(axios({
    method: 'get',
    url: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
    params: {
      convert: 'USD',
      symbol: 'BTC,ETH,EOS'
    },
    headers: {
      'X-CMC_PRO_API_KEY': cmcToken
    }
  }))
}

/**
 * Retrieve necessary properties from response object
 */
let getVals = <T>(x: T) => {
  return compose(
    pickAll(['name', 'symbol', 'price', 'percent_change_1h']),
    mergePaths([['quote', 'USD'], {}])
  )(x)
}

/**
 * Make string with properties returned from `getVals`
 * @param  {T} val
 */
let makeStrs = <T extends CryptoObject>(val: T): string => {
  let change = (/-/).test(String(val.percent_change_1h))
    ? `📉 ${val.percent_change_1h}% ↓`
    : `📈 ${val.percent_change_1h}% ↑`

  return `*${val.name}* (${val.symbol})\n*$${val.price.toFixed(2)}*\n${change} change within hour`
}
/**
 * Concat our array with strings from `makeStrs` to one string
 * @param  {ReadonlyArray<string>} val
 */
let joinStrs = (val: ReadonlyArray<string>): string => val.join('\n\n')

/**
 * Process AxiosResponse observable then return either error or value
 * @param  {T} x
 */
let mapVal = <T extends AxiosResponse>(x: T) => {
  // if error is exist in response then throw it
  if (x.data.status.error_message !== null) {
    console.error(x.data.status.error_message)
    throw new Error(x.data.status.error_message)
  }

  // compose our functions from bottom to top with Observable response as param
  // then return processed value
  return compose(
    joinStrs,
    Rmap(makeStrs),
    Rmap(getVals),
    values
  )(x.data.data)
}

/**
 * Creates observable which will run with given interval.
 *
 * `pipe` will do following:
 *
 * `startWith(0)` starts with 0 ms that it will make first response immediately.
 *
 * `switchMap` switch from request observable to new observable
 *
 * `RxMap` map observable and process response then return processed value
 *
 * `catchError` if there's any error is thrown then return error
 *
 * @param  {{}} params?
 * @param  {number} time default 1 hour interval
 */
let notifier = (params?: {}, time: number = 60000 * 60) => {
  return interval(time).pipe(
    startWith(0),
    switchMap(() => request(params)),
    RxMap(mapVal),
    catchError((err) => of(err))
  )
}

export {
  notifier
}
