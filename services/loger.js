const log4js = require("log4js");



log4js.configure({
    appenders: {
        // app: { type: "file", filename: "app.log" },
        out: {type: 'stdout'}
    },
    categories: {
        default: {
            appenders: ["out"],
            level: 'trace'
        }
    }
});

// export const logger = getLogger();

module.exports = log4js.getLogger();
