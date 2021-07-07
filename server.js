const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')


const port = process.env.PORT || 3000


app.use(express.static('public'));
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')
app.use(expressLayout)



app.get('/', (req, res) => {
    res.render('home')
})

app.get('/cart', (req, res) => {
    res.render('customers/cart')
})

app.get('/login', (req,res)=>{
    res.render('auth/login')
})

app.get('/register', (req,res)=>{
    res.render('auth/register')
})

app.listen(port, () => console.log(`App listening on ${port} port!`))