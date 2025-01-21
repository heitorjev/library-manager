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

app.get('/dash/loans', verify.rl, async (req, res) => {
    const loans = await Lending.find({})
    const students = await User.find({ role: "student" })
    const books = await Book.find({})

    //newBooks sort per alphabetical order
    books.sort((a, b) => {
        if(a.title > b.title) return 1
        if(a.title < b.title) return -1
        return 0
    })

    //newStudents sort per class order (6º, 7º, 8ºX,9ºX, 1ªX, 2ªX, 3ªX)
    students.sort((a, b) => {
        if(a.class > b.class) return 1
        if(a.class < b.class) return -1
        return 0
    })

    const fullName = req.session.name.split(' ');
    const user = {
        name: `${fullName[0]} ${fullName[fullName.length - 1]}`,
        firstLetters: `${fullName[0][0]}${fullName[fullName.length - 1][0]}`
    };
    
    res.render('dash/loans', { 
        user: user,
        students: students,
        books: books,
        loans: loans,
        currentPath: '/dash/loans'
    });
});

app.get('/dash/profile', verify.rl, async (req, res) => {
    const user1 = await User.findById(req.session.userId);

    const fullName = req.session.name.split(' ');
    const user = {
        name: `${fullName[0]} ${fullName[fullName.length - 1]}`,
        firstLetters: `${fullName[0][0]}${fullName[fullName.length - 1][0]}`,
        email: user1.email,
        passwordLength: user1.password.length,
        class: user1.class,
        role: user1.role.toUpperCase(),
        email: user1.username,
    };
    res.render('dash/profile', {
        user: user,
        password: '*'.repeat(user.passwordLength),
        currentPath: '/dash/profile'
    });
});
/*
/
/ POST ROUTES
/
*/

app.post('/api/loans/return', verify.rl, async (req, res) => {
    try {
        const loan = await Lending.findById(req.body.loanId);
        if (!loan) {
            return res.status(404).json({ error: 'Empréstimo não encontrado' });
        }

        loan.status = 'devolvido';
        loan.returnDate = new Date();
        await loan.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao processar devolução:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(process.env.PORT, () => {    
    console.warn("SERVIDOR INICIADO")
})

