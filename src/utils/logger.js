const winston = require('winston');
const configObject = require('../config/config.js');

const levels = {
    level:{
        fatal:0,
        error:1,
        warning:2,
        info:3,
        http:4,
        debug:5
    },
    colors:{
        fatal:"red",
        error:"magenta",
        warning:"yellow",
        info:"green",
        http:"cyan",
        debug:"blue"
    }
}

winston.addColors(levels.colors);

const developerLogger = winston.createLogger({
    levels: levels.level, 
    transports:[
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(winston.format.colorize({colors:levels.colors}),
            winston.format.simple())
        })
    ]
})

const productionLogger = winston.createLogger({
    levels: levels.level,
    transports:[
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(winston.format.colorize({colors:levels.colors}),
            winston.format.simple())
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level: "error",
            format: winston.format.simple()
        })
    ]
})

const logger = configObject.LOGGER === "production" ? productionLogger : developerLogger;

const addLogger = (req,res,next) =>{
    req.logger = logger;
    req.logger.http(`Metodo ${req.method} en la url ${req.url} - ${new Date().toLocaleDateString()}`)
    next();
}

module.exports = addLogger