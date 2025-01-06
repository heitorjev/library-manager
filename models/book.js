const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    autor:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    isbn:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    status:{
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('books', bookSchema)
