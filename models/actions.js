const mongoose = require('mongoose');

const actionsSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    action_target:{
        type: String,
        required: true,
        possibleValues: ['book', 'user', 'lending']
    },
    action_type:{
        type: String,
        required: true,
        possibleValues: ['create', 'update', 'delete']
    },
    action_date:{
        type: Date,
        required: true
    },
    user:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Action', actionsSchema)