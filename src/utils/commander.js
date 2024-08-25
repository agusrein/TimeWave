const {Command} = require('commander');
const program = new Command();

program.option('-p <port>','Conectado en el puerto', 8080)
program.option('--mode <mode>', 'Modo de trabajo', 'development' )
program.parse()

module.exports = program;