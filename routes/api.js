const express = require('express')
const router = express.Router()
const verify = require('../modules/verify')

const Lending = require('../models/lending')
const Book = require('../models/book')
const Student = require('../models/user')

router.post('/loans/return/:loanID', verify.rl, async (req, res) => {
    try {
        const loan = await Lending.findById(req.params.loanID);

        if (!loan) {
            return res.status(404).json({ status: "error", error: 'Empréstimo não encontrado', id: req.query.loanID, loan });
        }

        loan.status = 'devolvido';
        loan.returnDate = new Date();
        await loan.save();
        
        Book.updateOne({ _id: loan.bookID }, { $set: { status: '0' } }).exec();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao processar devolução:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})
router.post('/loans/create', verify.rl, async (req, res) => {
    try {
        const {bookId, studentId, lendingDate, returnDate} = req.body;

        if (!bookId || !studentId || !lendingDate || !returnDate) {
            return res.status(400).json({ error: 'Parâmetros preenchidos incorretamente' });
        }
        
        const student = await Student.findById(studentId);
        const book = await Book.findById(bookId);

        const lendingObj = {
            bookID: bookId,
            studentID: studentId,
            studentName: student.name,
            bookName: book.title,
            returnDate: new Date(returnDate),
            lendingDate: new Date(lendingDate),
        }

        await Lending.create(lendingObj).then(() => {
            Book.updateOne({ _id: bookId }, { $set: { status: '1' } }).exec();
            res.json({ success: true });
        }).catch((error) => {
            console.error('Erro ao criar empréstimo:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        })

    } catch (error) {
        console.error('Erro ao processar devolução', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})


router.post('/students/create', verify.rl, async (req, res) => {
    try {
        const student = {
            name: req.body.name,
            email: null,
            class: req.body.class,
            role: req.body.role,
            password: null
        }
        await Student.create(student)
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})
router.post('/students/edit/:studentID', verify.rl, async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentID);

        const newStudentInfo = {
            name: req.body.name,
            email: req.body.username,
            class: req.body.class,
        }
        if (!student) {
            return res.status(404).json({ error: 'Estudante não encontrado' });
        }

        await student.updateOne(newStudentInfo);

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao deletar estudante:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})
router.post('/students/delete/:studentID', verify.rl, async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentID);

        if (!student) {
            return res.status(404).json({ error: 'Estudante não encontrado' });
        }

        await student.deleteOne({ _id: req.params.studentID });
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao deletar estudante:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

/*
/
/   BOOK ROUTES
/
*/
router.post('/books/create', verify.rl, async (req, res) => {
    try {
        const book = {
            title: req.body.title,
            autor: req.body.autor,
            category: req.body.category,
            status: 0
        }

        await Book.create(book).then(() => {
            res.json({ success: true });
        }).catch((error) => {
            console.error('Erro ao criar livro:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        })
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

router.post('/books/edit/:bookID', verify.rl, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookID);

        const newBookInfo = {
            title: req.body.title,
            autor: req.body.autor,
            category: req.body.category
        }
        if (!book) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        await book.updateOne(newBookInfo);

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao editar livro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

router.post('/books/delete/:bookID', verify.rl, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookID);

        if (!book) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }

        await Book.deleteOne({ _id: req.params.bookID });
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})


/*
/
/  PROFILE ROUTES
/
*/
router.post('/profile/edit', verify.rl, async (req, res) => {
    try {
        const user = await Student.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (user.password !== req.body.password) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        const password = req.body.newPassword ? req.body.newPassword : req.body.password;

        const newUserInfo = {
            name: req.body.name,
            email: req.body.email,
            class: req.body.class,
            password: password,
        }

        await user.updateOne(newUserInfo);

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao editar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
})

module.exports = router