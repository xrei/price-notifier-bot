import dotenv from 'dotenv-safe'
dotenv.config()
import { getVar } from './utils'
import startBot from './bot'

const start = async () => {
  console.log('Starting...')
  await startBot(getVar('TOKEN'))
}

start()
