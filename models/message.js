const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

},{timestamps: true});

const Message = mongoose.model('Message', Schema);

module.exports = Message;