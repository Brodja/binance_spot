const logger = require('./loger')
const client = require('./client')
const app = require('../app')
const bot = require('./bot')

let result = [];
let GLOBAL_COUNTER = 0;



exports.getHightOrdesFromArray = async function getHightOrdesFromArray(array) {
    logger.info('Start get hight ordes');
    const currentPriceList = (await client.tickerPrice('', array)).data

    for (const coin of array) {
        const response = await client.depth(coin, { limit: 500 });
        const currentPrice = currentPriceList.find(item => item.symbol == coin).price
        const priceRatio = +currentPrice * 0.05
        const bidsList = response.data.bids.filter(item => +item[0] > +currentPrice - priceRatio && +item[0] < +currentPrice + priceRatio);
        const asksList = response.data.asks.filter(item => +item[0] > +currentPrice - priceRatio && +item[0] < +currentPrice + priceRatio);
        const currentAverage = +app.averagelist.find(item => item.coin == coin).average
        const maxRoll = bidsList.length >= asksList.length ? bidsList.length : asksList.length
        for(let i = 0; i < maxRoll; i++){
            if(bidsList[i] && +bidsList[i][1] > currentAverage * 5 && +currentAverage * +currentPrice > 20000){
                findItem(coin, bidsList[i][0], bidsList[i][1], 'bid', currentAverage, currentPrice, priceRatio)
            }
            if (asksList[i] && +asksList[i][1] > currentAverage * 5 && +currentAverage * +currentPrice > 20000) {
                findItem(coin, asksList[i][0], asksList[i][1], 'ask', currentAverage, currentPrice, priceRatio)
            }
        }
    }
    let oldCounter = GLOBAL_COUNTER
    result = result.filter((item) => { return item.status == oldCounter })
    GLOBAL_COUNTER++;
    logger.info(`Finish get hight ordes: ${GLOBAL_COUNTER}`);
}

function findItem(coin, arrItem0, arrItem1, type, currentAverage, currentPrice, priceRatio){
    let item = result.find(item => item.id == coin + arrItem0)
    if (item) {
        item.minutes += 1;
        item.status = GLOBAL_COUNTER;
        if (item.minutes >= 4) {
            logger.error(`${type} | period: ${item.minutes} | C: ${coin} | oPrice: ${arrItem0} | cPrice: ${currentPrice} | diff: ${(+currentPrice - +arrItem0).toFixed(9)} | priceRatio: ${priceRatio.toFixed(9)} | value: ${+arrItem1} | avg: ${Math.round(currentAverage)} | ratio: ${Math.round(+arrItem1 / currentAverage)}`);
            if(item.minutes % 4 === 0){
                let obj = {
                    type,
                    period: item.minutes,
                    coin,
                    orderPice: arrItem0,
                    currentPrice,
                    diff: (+currentPrice - +arrItem0).toFixed(9),
                    priceRatio: priceRatio.toFixed(9) ,
                    ratio: Math.round(+arrItem1 / currentAverage)
                }
                bot.botSendMess(obj);
            }
        } 
    } else {
        result.push({
            id: coin + arrItem0,
            type: type,
            coin: coin,
            price: +arrItem0,
            ratio: Math.round(+arrItem1 / currentAverage),
            minutes: 0,
            status: GLOBAL_COUNTER
        });
    }
}


// for (let i = 0; i < bidsList.length; i++) {
//     if (+bidsList[i][1] > currentAverage * 5) {
//         let item = result.find(item => item.id == coin + bidsList[i][0])
//         if (item) {
//             item.minutes += 1;
//             item.status = GLOBAL_COUNTER;
//             if (item.minutes >= 5) {
//                 logger.warn(`type: bid | minutes: ${item.minutes} | coin: ${coin} | price: ${bidsList[i][0]} | value: ${+bidsList[i][1]} | average: ${Math.round(currentAverage)} | ratio: ${Math.round(+bidsList[i][1] / currentAverage)}`);
//             } else if (item.minutes >= 2) {
//                 logger.fatal(`type: bid | minutes: ${item.minutes} | coin: ${coin} | price: ${bidsList[i][0]} | value: ${+bidsList[i][1]} | average: ${Math.round(currentAverage)} | ratio: ${Math.round(+bidsList[i][1] / currentAverage)}`);
//             }
//         } else {
//             result.push({
//                 id: coin + bidsList[i][0],
//                 type: 'bid',
//                 coin: coin,
//                 price: +bidsList[i][0],
//                 ratio: Math.round(+bidsList[i][1] / currentAverage),
//                 minutes: 0,
//                 status: GLOBAL_COUNTER
//             });
//         }
//     }
//     if (+asksList[i][1] > currentAverage * 5) {
//         let item = result.find(item => item.id == coin + asksList[i][0])
//         if (item) {
//             item.minutes += 1;
//             item.status = GLOBAL_COUNTER;
//             if (item.minutes >= 5) {
//                 logger.warn(`type: ask | minutes: ${item.minutes} | coin: ${coin} | price: ${asksList[i][0]} | value: ${+asksList[i][1]} | average: ${Math.round(currentAverage)} | ratio: ${Math.round(+asksList[i][1] / currentAverage)}`);
//             } else if (item.minutes >= 2) {
//                 logger.fatal(`type: ask | minutes: ${item.minutes} | coin: ${coin} | price: ${asksList[i][0]} | value: ${+asksList[i][1]} | average: ${Math.round(currentAverage)} | ratio: ${Math.round(+asksList[i][1] / currentAverage)}`);
//             }
//         } else {
//             result.push({
//                 id: coin + bidsList[i][0],
//                 type: 'ask',
//                 coin: coin,
//                 price: +bidsList[i][0],
//                 ratio: Math.round(+asksList[i][1] / currentAverage),
//                 minutes: 0,
//                 status: GLOBAL_COUNTER
//             });
//         }
//     }
// }