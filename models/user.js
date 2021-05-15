const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
 //       required: true,
        trim: true,
    },
    username: {
        type: String,
        minlength: 3,
        maxlength: 30,
        trim: true,
//        required: true,
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
//        required: true,
        maxlength: 40
    },
    password: {
        trim: true,
        minlength: 3,
        type: String,
 //       required: true,
    },
    avatarurl: {
        type: String
    },
    avatar: {
        type: Buffer
    },
    friends : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friend'
    }],
    
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user'
})


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'socialnetworking')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

// userSchema.methods.getPublicProfile = function() {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne( {username})
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//hash password
userSchema.pre('save', async function (next) {
    const user = this

    // console.log('before saving')
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


const User = mongoose.model("User", userSchema);
module.exports = User;