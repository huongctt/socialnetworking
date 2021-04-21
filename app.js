const mongoose = require ('mongoose')
const User = require ('./models/user')
const Comment = require ('./models/comment')
const Post = require ('./models/post')
const Like = require ('./models/like')
const Chat = require ('./models/chat')
const Message = require ('./models/message')
const Friend = require ('./models/friend')

mongoose.connect('mongodb://localhost:27017/social-networking',{
    useNewUrlParser: true,
    useCreateIndex: true ,
    useUnifiedTopology: true
})

mongoose.Promise = global.Promise;
const me = new User({
    name: 'Huong Dinh',
    username:'huong12224',
    email: '  dinnnnhuonggsj@gmail.com',
    password: 'newword'
})

me.save().then(() => {
    console.log(me)
}).catch((error) => {
    console.log('error', error)
})

const myPost = new Post({
     content: 'This is a new post',
     user: me._id
 })

myPost.save().then(() => {
    console.log(myPost)
}).catch((error) => {
    console.log('posting error', error)
})

const myComment = new Comment({
    content: 'This is a new comment',
    user: me._id,
    post: myPost._id
})

myComment.save().then(() => {
    console.log(myComment)
}).catch((error) => {
    console.log('commenting error', error)
})

const myLike = new Like({
    user: me._id,
    post: myPost._id
})

myLike.save().then(() => {
    console.log(myLike)
}).catch((error) => {
    console.log('liking error', error)
})