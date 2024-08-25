const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const usersRouter = require('./routes/user.router.js');
const sessionsRouter = require('./routes/session.router.js');
const loggerRouter = require('./routes/logger.router.js');
const express = require('express');
const app = express();
const {PUERTO} = require('./config/config.js');
const exphbs = require('express-handlebars');
const passport = require('passport');
const initializePassport = require('./config/passport.config.js');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error.js');
const addLogger = require('./utils/logger.js');
const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
require('./database.js')





//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
app.use(addLogger);


//ROUTES
app.use('/api', productsRouter);
app.use('/api', cartsRouter);
app.use('/api', sessionsRouter);
app.use('/api', usersRouter);
app.use('/api', loggerRouter);
app.use('/', viewsRouter);



//HANDLEBARS 
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando puerto http//localhost:${PUERTO}`);
})


//WEBSOCKET
const SocketManager = require('./sockets/socketManager.js');
new SocketManager(httpServer);


//SWAGGER
const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: 'Documentación de la App Reggina Trattoria',
            description: 'Aplicativo por el cual, se podrá realizar pedidos al restaurante Reggina Trattoria de lo que se encuentre en el menú del mismo. También se podrá visualizar tanto las órdenes de compra como los pagos gestionados por el usuario.'
        }
    },
    apis: ['./src/docs/**/*.yaml']
}
const specs = swaggerJSdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))



//MIDDLEWARE
app.use(errorHandler);



