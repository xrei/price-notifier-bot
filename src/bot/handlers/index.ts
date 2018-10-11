import { ContextMessageUpdate } from 'telegraf'
import { Message } from 'telegram-typings'
import { Subscription } from 'rxjs'
import { mainKb, startedKb } from '../keyboard'
import { notifier } from '../../api'
import Maybe from '../../Maybe'
import { prop } from '../../utils'

const subscriptions: Map<number, Subscription> = new Map()

const getUserId = (ctx: ContextMessageUpdate) => {
  return  Maybe.of(ctx)
    .map(prop('message'))
    .map(prop('from'))
    .map(prop('id'))
}

export function onStop(ctx: ContextMessageUpdate): Promise<Message> {
  getUserId(ctx)
    .map(v => subscriptions.get(v))
    .map(v => v.unsubscribe())

  return ctx.reply('Stop updates', mainKb)
}

export async function onStart(ctx: ContextMessageUpdate): Promise<Message> {
  // let url = 'https://jsonplaceholder.typicode.com/todos/1'
  let s = notifier().subscribe(res => ctx.replyWithMarkdown(res as string))

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
