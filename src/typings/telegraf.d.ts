import * as Telegraf from 'telegraf'

declare module 'telegraf' {
  export interface ContextMessageUpdate {
    scene: any,
    answerCbQuery(text?: string, showAlert?: boolean, extra?: object): Promise<boolean>,
    deleteMessage(id: string): Promise<boolean>
  }

}
