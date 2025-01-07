// Modelo de empréstimo e devolução de livros
const mongoose = require('mongoose')

const lendingSchema = new mongoose.Schema({
    bookID: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    returning: {
        type: Date,
        default: null
    },
    lending: {
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: Number,
        enum: [0, 1],  // 0 = emprestado, 1 = devolvido
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('lend', lendingSchema)
