const mongoose = require('mongoose');
const User = require('./user.js')
const Schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },  

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

},{timestamps: true});



const Comment = mongoose.model('Comment', Schema);

module.exports = Comment;