// import { ContextMessageUpdate } from 'telegraf'
// import { Message } from 'telegram-typings'
// import {mainKb} from '../keyboard'

// export const sceneCleaner = () => async (ctx: ContextMessageUpdate) => {
//   ctx.scene.state.messages.forEach(({ message_id: id }: { readonly message_id: string }) => {
//     try {
//       ctx.deleteMessage(id)
//     } catch (error) {
//       console.log(error)
//     }
//   })
// }

// export async function onCancel(ctx: ContextMessageUpdate): Promise<Message> {
//   await ctx.answerCbQuery()
//   return ctx.scene.leave()
// }

// export async function saveCurrency(ctx: ContextMessageUpdate): Promise<Message> {
//   await ctx.answerCbQuery()
//   console.log(ctx.update)
//   return ctx.reply('clicked')
// }

// export async function onNext(stageName: string): Promise<object> {
//   return async (ctx: ContextMessageUpdate): Promise<Message> => {
//     await ctx.answerCbQuery()
//     return ctx.scene.enter(stageName)
//   }
// }
