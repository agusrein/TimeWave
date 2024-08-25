const bcrypt = require('bcrypt');

const createHash = (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync(10));

const isValidPassword = (pass,user) => bcrypt.compareSync(pass, user.pass);

module.exports = {createHash, isValidPassword};
