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


// Assets
app.use(express.static('public'));
app.use(express.json())

app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')
app.use(expressLayout)
app.use(flash())


// Global middelwares
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})


const webRoutes = require('./routes/web')
app.use('/', webRoutes)



app.listen(port, () => console.log(`App listening on ${port} port!`))