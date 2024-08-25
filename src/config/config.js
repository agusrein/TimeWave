const program = require('../utils/commander.js');
const dotenv = require('dotenv');

const { mode } = program.opts();
dotenv.config({
  path: mode == 'production' ? './.env.production' : './.env.developer'
})


const configObject = {
  PUERTO: process.env.PUERTO,
  MONGO_URL: process.env.MONGO_URL,
  COOKIETOKEN: process.env.COOKIETOKEN,
  JWTKEY: process.env.JWTKEY,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  LOGGER: process.env.LOGGER,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
}


module.exports = configObject
