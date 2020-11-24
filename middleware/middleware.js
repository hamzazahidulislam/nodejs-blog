const exprees = require('express')
const morgan = require('morgan')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('config')
const flash = require('connect-flash')
const {
    bindUserWithRequest
} = require('./authMiddleware')
const setLocals = require('./setLocals')

const MONGODB_URL = `mongodb+srv://${config.get('db-admin')}:${config.get('db-pass')}@cluster0.r2pfu.mongodb.net/${config.get('db-name')}`

var store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});

const middleware = [
    morgan('dev'),
    exprees.static('public'),
    exprees.urlencoded({
        extended: true
    }),
    exprees.json(),
    session({
        secret: config.get('secret-key'),
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
]
module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}