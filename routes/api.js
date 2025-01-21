const express = require('express')
const router = express.Router()
const verify = require('../modules/verify')

const Lending = require('../models/lending')
const Book = require('../models/book')
const Student = require('../models/user')

router.post('/loans/return', verify.rl, async (req, res) => {
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
        console.log(lendingObj);

        await Lending.create(lendingObj).then(() => {
            Book.updateOne({ _id: bookId }, { $set: { status: '0' } }).exec();
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

module.exports = router