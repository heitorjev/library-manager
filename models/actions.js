const mongoose = require('mongoose');

const actionsSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    action_type:{
        type: String,
        required: true,
        possibleValues: ['create', 'update', 'delete']
    }

})