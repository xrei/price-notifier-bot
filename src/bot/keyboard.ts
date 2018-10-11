import Markup from 'telegraf/markup'

const mainKb = Markup.keyboard([['🚀 Start']]).resize().extra()

const startedKb = Markup.keyboard([['⛔️ Stop']]).resize().extra()

export { mainKb, startedKb }
