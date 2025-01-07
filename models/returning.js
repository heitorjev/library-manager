const mongoose = require('mongoose')

const returningSchema = new mongoose.Schema({
    lendingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lending',
        required: true
    },
    returnDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    studentID: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('return', returningSchema)
