const { Spot } = require('@binance/connector')
const apiKey = process.env.apiKey
const apiSecret = process.env.apiSecret

module.exports = new Spot(apiKey, apiSecret)