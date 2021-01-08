import Telegraf from 'telegraf'
import session from 'telegraf/session'
import {onStop, startCommandHandler, onStart} from './handlers'

const startBot = async (token: string): Promise<void> => {
  const bot = new Telegraf(token)
  bot.use(session())

  bot.start(startCommandHandler)
  bot.hears('🚀 Start', onStart)
  bot.hears('⛔️ Stop', onStop)

  bot.startPolling()
}

export default startBot
