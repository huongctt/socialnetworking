const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatSchema = new Schema({
    members: [{
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
})

module.exports = mongoose.model('Chat', chatSchema)