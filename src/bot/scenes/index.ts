// import { ContextMessageUpdate } from 'telegraf'
// import Markup from 'telegraf/markup'
// import Scene from 'telegraf/scenes/base'
// import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';
// import { Message } from 'telegram-typings'
// import { onCancel, onNext, saveCurrency, sceneCleaner } from './utils';

// const navigKeyboard = (): ExtraReplyMessage => Markup.inlineKeyboard([
//     Markup.callbackButton('Cancel', 'Cancel'),
//     Markup.callbackButton('Next', 'Next')
//   ]).extra()

// const chooseCurrencies = new Scene('chooseCurrencies')
// chooseCurrencies.enter(stepCurrencies)
// chooseCurrencies.action('Cancel', onCancel)
// chooseCurrencies.action('Next', onNext('chooseSource'))
// chooseCurrencies.action('saveCurrency', saveCurrency)
// chooseCurrencies.leave(sceneCleaner())

// async function stepCurrencies(ctx: ContextMessageUpdate, next: any): Promise<Message> {
//   const messages: Message[] = []

//   messages.push(
//     await ctx.reply(
//     'Choose currencies',
//     Markup.inlineKeyboard([
//       Markup.callbackButton('BTC', 'saveCurrency'),
//       Markup.callbackButton('ETH', 'saveCurrency')
//     ]).extra())
//   )
//   messages.push(
//     await ctx.reply(
//       'When you\'re done click next button below\nOr cancel to discard changes.',
//       navigKeyboard()
//     )
//   )
//   ctx.scene.state.messages = messages
//   return next()
// }

// export {
//   chooseCurrencies
// }
