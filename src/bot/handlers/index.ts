import { Context } from 'telegraf/typings'
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
 */
const getUserId = (ctx: Context) => {
  return  Maybe.of(ctx)
    .map(prop('message'))
    .map(prop('from'))
    .map(prop('id'))
}

/**
 * Unsubscribe current user from observable
 */
export function onStop(ctx: Context): Promise<Message> {
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
 */
export async function onStart(ctx: Context): Promise<Message> {
  let s = notifier().subscribe(res => {
    return ctx.replyWithMarkdown(res.message as string)
  })

  getUserId(ctx)
    .map(v => subscriptions.set(v, s))

  return ctx.reply('Running settings\nInterval: 1 hour\nFrom: coinmarketcap.com', startedKb)
}

export function startCommandHandler(ctx: Context): Promise<Message> {
  const greeting = 'This bot will notify you about current cryptocurrency prices from coinmarketcap'
  return ctx.reply(
    greeting,
    mainKb
  )
}
