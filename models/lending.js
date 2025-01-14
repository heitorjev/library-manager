// Modelo de empréstimo e devolução de livros
const mongoose = require('mongoose')

const lendingSchema = new mongoose.Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    returnDate: {
        type: Date,
        default: null
    },
    lendingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['emprestado', 'devolvido'],
        default: 'emprestado'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('lending', lendingSchema)