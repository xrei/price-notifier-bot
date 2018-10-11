import { interval, Observable, from, of } from 'rxjs'
import { switchMap, map as RxMap, startWith, catchError } from 'rxjs/operators'
import axios, { AxiosResponse } from 'axios'
import { getVar, mergePaths } from '../utils'
import { compose, map as Rmap, values, pickAll} from 'ramda'
// import Maybe from '../Maybe'

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

let getVals = <T>(x: T) => {
  return compose(
    pickAll(['name', 'symbol', 'price', 'percent_change_1h']),
    mergePaths([['quote', 'USD'], {}])
  )(x)
}

interface CryptoObject {
  name: string
  symbol: string
  price: number
  percent_change_1h: number
}
let makeStrs = <T extends CryptoObject>(val: T): string => {
  return `*${val.name}* (${val.symbol})\n*$${val.price.toFixed(2)}*\n${val.percent_change_1h}% change within hour`
}

let joinStrs = (val: ReadonlyArray<string>): string => val.join('\n\n')

let mapVal = <T extends AxiosResponse>(x: T) => {
  if (x.data.status.error_message !== null) {
    console.error(x.data.status.error_message)
    throw new Error(x.data.status.error_message)
  }

  return compose(
    joinStrs,
    Rmap(makeStrs),
    Rmap(getVals),
    values
  )(x.data.data)
}

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
