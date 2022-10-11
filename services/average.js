
const logger = require('./loger')
const client = require('./client')
const app = require('../app')
const coinsArray = ['DOGEUSDT', 'DYDXUSDT', 'MATICUSDT', 'ADAUSDT', 'FLOWUSDT', 'GRTUSDT', 'NEARUSDT'];
exports.getAverageFromArray = async function getAverageFromArray(array){
    logger.debug('Start get average');
    for (const coin of array){
      const response = await client.aggTrades(coin, {
        'endTime': Date.now(),
        'startTime': Date.now() - 3600000 
      });
      let count = 0;
      response.data.forEach(element => {
        count += +element.q;
      });
      app.averagelist.push({
        'coin': coin,
        'average': count / 12
      });
    }
    logger.debug('Finish get average');
  }


  