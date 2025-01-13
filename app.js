const express = require("express")
const bodyParser = require('body-parser');
const session = require('cookie-session');
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
const authRoutes = require('./routes/auth')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL).then(console.warn("DATABASE CONECTADA"))

const Book = require('./models/book')
const User = require('./models/user')
const Lending = require('./models/lending')

app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

app.use('/auth', authRoutes)

app.get('/', async (req, res) => {
    const books = await Book.find({})
    res.render('index', { books: books })
})

app.get('/login/:userrole', verify.rH, async (req, res) => {
    res.render('login', { user_role: req.params.userrole })

})
/*
/
/ DASHBOARD ROUTES
/
*/

app.get('/dash', verify.rl ,async (req, res) => {
    const books = await Book.find({})
    const students = await User.find({ role: "student" })
    const lendings = await Lending.find({})
    const fullName = req.session.name.split(' ')
    const user = {
        name: `${fullName[0]} ${fullName[fullName.length - 1]}`,
        firstLetters: `${fullName[0][0]}${fullName[fullName.length - 1][0]}`
    } 

    res.render(__dirname + '/views/dash/home.ejs', { 
        user: user,
        books: books.length, 
        students: students.length, 
        lending: lendings.length,
        currentPath: '/dash'
    })
})
app.get('/dash/books', verify.rl ,async (req, res) => {
    const books = await Book.find({})
    const fullName = req.session.name.split(' ')
    const user = {
        name: `${fullName[0]} ${fullName[fullName.length - 1]}`,
        firstLetters: `${fullName[0][0]}${fullName[fullName.length - 1][0]}`
    } 
    
    res.render(__dirname + '/views/dash/books.ejs', { 
        user: user,
        books: books, 
        currentPath: '/dash/books'
    })
})
app.get('/dash/users', verify.rl ,async (req, res) => {
    const students = await User.find({ role: "student" })
    const fullName = req.session.name.split(' ')
    const user = {
        name: `${fullName[0]} ${fullName[fullName.length - 1]}`,
        firstLetters: `${fullName[0][0]}${fullName[fullName.length - 1][0]}`
    } 
    
    res.render(__dirname + '/views/dash/users.ejs', { 
        user: user,
        students: students,
        currentPath: '/dash/users'
    })
})




/*
/
/ POST ROUTES
/
*/



app.listen(process.env.PORT, () => {    
    console.warn("SERVIDOR INICIADO")
})

