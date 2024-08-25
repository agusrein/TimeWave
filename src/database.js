const mongoose = require('mongoose');
const {MONGO_URL} = require('./config/config.js')

mongoose.connect(MONGO_URL)
.then(console.log('conectado'))
.catch(error=>{console.log(error)})