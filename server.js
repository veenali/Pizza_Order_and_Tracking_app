const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const ejsMate = require('ejs-mate')


const port = process.env.PORT || 3000


// app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)



app.get('/', (req, res) => {
    res.render('home')
})

app.listen(port, () => console.log(`App listening on ${port} port!`))