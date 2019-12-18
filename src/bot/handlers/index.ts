import { ContextMessageUpdate } from 'telegraf'
import { Message } from 'telegram-typings'
import { Subscription } from 'rxjs'
import { mainKb, startedKb } from '../keyboard'
import { notifier } from '../../api'
import Maybe from '../../Maybe'
import { prop } from '../../utils'

// Map to store our current subscriptions
const subscriptions: Map<number, Subscription> = new Map()
let interval: any
/**
 * Check if user id is persist then return it
 * @param  {ContextMessageUpdate} ctx
 */
const getUserId = (ctx: ContextMessageUpdate) => {
  return  Maybe.of(ctx)
    .map(prop('message'))
    .map(prop('from'))
    .map(prop('id'))
}

/**
 * Unsubscribe current user from observable
 * @param  {ContextMessageUpdate} ctx
 */
export function onStop(ctx: ContextMessageUpdate): Promise<Message> {
  getUserId(ctx)
    .map(v => subscriptions.get(v))
    .map(v => v.unsubscribe())
  if (interval) {
    clearInterval(interval)
  }
  return ctx.reply('Stop updates', mainKb)
}

/**
 * Create subscription from user request and save it to subscriptions
 * @param  {ContextMessageUpdate} ctx
 */
export async function onStart(ctx: ContextMessageUpdate): Promise<Message> {
  let s = notifier().subscribe(res => {
    spamIfPrice(110, Number(res.ethPrice), ctx)
    return ctx.replyWithMarkdown(res.message as string)
  })

  getUserId(ctx)
    .map(v => subscriptions.set(v, s))

  return ctx.reply('Running settings\nInterval: 1 hour\nFrom: coinmarketcap.com', startedKb)
}

export function startCommandHandler(ctx: ContextMessageUpdate): Promise<Message> {
  const greeting = 'This bot will notify you about current cryptocurrency prices from coinmarketcap'
  return ctx.reply(
    greeting,
    mainKb
  )
}

function spamIfPrice(watchPrice: number, price: number, ctx: ContextMessageUpdate): void {
  if (price < watchPrice) {
    interval = setInterval(() => {
      ctx.reply(`The price is lower than ${watchPrice}`)
    }, 5000)
    setTimeout(() => {
      clearInterval(interval)
    }, 15 * 60000)
  }
}
