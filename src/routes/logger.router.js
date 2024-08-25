const express = require('express');
const router = express.Router();


router.get('/loggerTest', (req, res) => {
    try {
        req.logger.fatal('message FATAL');
        req.logger.error('message ERROR');
        req.logger.warning('message WARNING');
        req.logger.info('message INFO');
        req.logger.http('message HTTP');
        req.logger.debug('message DEBUG');
        res.send('Logs Generados')
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;