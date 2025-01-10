const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'teacher'],
        default: 'student'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)