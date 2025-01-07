const express = require("express")
const bodyParser = require('body-parser');
const session = require('cookie-session');
const router = express.Router()
require('dotenv').config()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: true
    }
}))
const verify = require('./modules/verify')

const mongoose = require('mongoose')
const database = require('./modules/mongoose')
mongoose.connect(process.env.DB_URL).then(console.warn("DATABASE CONECTADA"))

const Book = require('./models/book')

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', async (req, res) => {
    const books = await Book.find({})
    res.render('index', { books: books })
})
app.get('/login', async (req, res) => {
    res.render('login')
})

/*
/
/ DASHBOARD ROUTES
/
*/

app.get('/dash', async (req, res) => {
    res.render(__dirname + '/views/dash/home.ejs')
})


/*
/
/ POST ROUTES
/
*/



app.post('/logout', async (req, res) => {
    req.session.userId = null
    res.redirect('/')
})


app.listen(process.env.PORT, () => {    
    console.warn("SERVIDOR INICIADO")
})

