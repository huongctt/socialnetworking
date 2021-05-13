const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    avatarStatus:{
        type: Boolean,
        default: false
    },
    username:{
        type: String
    },   

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

},{timestamps: true});

const Comment = mongoose.model('Comment', Schema);

module.exports = Comment;