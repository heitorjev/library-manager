const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
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
    status:{
        type: Number,
        default: 0
        //0: available
        //1: borrowed
    },
})

module.exports = mongoose.model('books', bookSchema)
