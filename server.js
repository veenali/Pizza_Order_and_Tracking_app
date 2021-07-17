require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo');
const passport = require('passport')
const Emitter = require('events')

const port = process.env.PORT || 3000

// Database connection
mongoose.connect('mongodb://localhost:27017/pizza', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database connected....")
}).catch(err => {
    console.log("Connection Failed")
})


// Session store
const mongoStore = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/pizza',
    collectionName: 'sessions',
})


// Event emitter -- given by node under events package(already there no need to install it)
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)  //So that we are able to access the variable in the statusController.js file



// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// Passport config. This configuration should always be after session config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


// Assets
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')
app.use(expressLayout)
app.use(flash())


// Global middelwares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


const webRoutes = require('./routes/web')
app.use('/', webRoutes)



const server = app.listen(port, () => console.log(`App listening on ${port} port!`))



// All socket connections
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join 
    socket.on('join', (roomName) => {
        // Private room created for each order
        socket.join(roomName)
    })
})

// The event that was emitted from statusController.js file 
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

// The event that was emitted from customers/orderController.js file 
eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})