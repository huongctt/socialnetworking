const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: "",
        trim: true,
        maxlength: 250,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 40
    },
    password: {
        trim: true,
        minlength: 3,
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    friends : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friend'
    }]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;