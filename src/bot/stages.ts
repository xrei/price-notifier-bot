
import Stage from 'telegraf/stage'
import { chooseCurrencies } from './scenes'

const stage = new Stage([chooseCurrencies])
stage.command('Cancel', () => Stage.leave())

export default stage
