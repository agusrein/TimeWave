const Errors = require('../services/errors/enum.js');
const errorHandler = (error,req,res,next) =>{
    console.log(error)
        switch(error.code) {
            case Errors.INVALID_TYPE:
            case Errors.ERROR_DATABASE:
            case Errors.ERROR_ROUTE:
            case Errors.UNDEFINED_DATA:
                res.status(400).send({ status: false, error: error.name, message: error.message, cause: error.cause });
                break;
            default:
                next(error);
        }
}
module.exports = errorHandler;