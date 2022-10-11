const logger = require('./services/loger.js')
const average = require('./services/average.js')
const orders = require('./services/orders.js')
const conisList = require('./coins_list.js')

const coinsArray = ['DOGEUSDT', 'DYDXUSDT', 'MATICUSDT', 'ADAUSDT', 'FLOWUSDT', 'GRTUSDT', 'NEARUSDT'];
const averagelist = [];



average.getAverageFromArray(conisList).then(()=> {
    orders.getHightOrdesFromArray(conisList)
    setInterval(()=>{
        orders.getHightOrdesFromArray(conisList)
    }, 90000)
})




exports.averagelist = averagelist;