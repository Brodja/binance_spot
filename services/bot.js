
const { Telegraf } = require('telegraf');
const logger = require('./loger')

const bot = new Telegraf('5410381553:AAEp8Xb0XwG3mIlN5TvYhxeCSWRRtajsCsk')
const usersList = []
bot.start((ctx) => {
    // console.log(ctx.update.message.from.username)
    logger.trace(`New user ${ctx.update.message.from.username} - ${ctx.update.message.from.first_name} - ${ctx.update.message.from.last_name}`);
    usersList.push(ctx.update.message.chat.id)
    ctx.reply('Welcome')
});
bot.launch();
logger.info('Bot was started!');

exports.botSendMess = async function sendMessageAllUsers(obj){
    for(let i = 0; i < usersList.length; i++){
        bot.telegram.sendMessage(usersList[i], `
        Тип: ${obj.type},
        Количество периодов: ${obj.period},
        Монета: ${obj.coin},
        Цена ордера: ${obj.orderPice},
        Цена монеты: ${obj.currentPrice},
        Разница цен: ${obj.diff},
        5% от цены монеты: ${obj.priceRatio},
        ratio: ${obj.ratio}.
        `) 
    }
}