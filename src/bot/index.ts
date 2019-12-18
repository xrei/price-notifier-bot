import Telegraf from 'telegraf'
import session from 'telegraf/session'
import {onStop, startCommandHandler, onStart} from './handlers'
// import stage from './scenes/stages'

const startBot = (token: string): void => {
  const bot = new Telegraf(token)
  bot.use(session())
  // bot.use(stage.middleware())
  // bot.use(Telegraf.log())

  bot.start(startCommandHandler)
  bot.hears('🚀 Start', onStart)
  bot.hears('⛔️ Stop', onStop)

  bot.startPolling()
}

export default startBot
