const express = require ('express')
const bodyParser = require("body-parser")  
const multer = require('multer')
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Friend = require('../models/friend.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please update an image'))
        }
        cb(undefined, true)
    }
})

const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));
//create post
// router.post('/posts/create', auth, async (req, res) => {
//     // console.log(req.body)
//     const post = new Post({
//         ...req.body,  
//         user: req.user._id
//     })

//     try {
//         // await post.save()
//         res.status(201).send(post)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })
router.post('/posts/create', auth,upload.single('imagePost'), async (req, res) => {
    // console.log(req.file)
    const post = new Post({
        ...req.body,  
        user: req.user._id
    })
    if(req.file){
        post.imagePost = req.file.buffer
        post.imageStatus = true
    }

    try {
        await post.save()
        // res.status(201).send(post)
        res.redirect('/newsfeed')
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/posts/image/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post || !post.imagePost) {
            throw new Error()
        }else {
            res.set('Content-Type', 'image/png')
            res.send(post.imagePost)
        }

    } catch(e) {
        res.status(404).send()
        console.log(e)
    }
})

router.get('/posts', auth,  async (req, res) => {
    try {
        await req.user.populate('posts').execPopulate();
        res.send(req.user.posts)
    } catch (e) {
        res.status(500).send()
    }
})



router.get('/newsfeed',auth,  async (req, res) => {
    // console.log('Cookies: ', req.cookies.authToken)
    const match = {friends : true }
    try {
        await req.user.populate({
            path: 'friends',
            match: match
            
        }).execPopulate();
        // res.send(req.user.friends)

        var post = await Promise.all(req.user.friends.map(friend => Post.find({user: friend.receiver})))
        var postArr = [];
        //console.log(post.length)
        for(let i = 0; i < post.length; i++){
            if (post[i].length != 0) {
                var user = await User.findById(post[i][0].user)
                
                for (let j = 0; j < post[i].length; j++){
                    var commentpost = await Comment.find({post:post[i][j]._id})
                    // console.log(commentpost)
                    var apost = {
                        username: user.username,
                        avatarStatus: user.avatarStatus,
                        userid: user._id,
                        imageStatus: post[i][j].imageStatus,
                        postid:post[i][j]._id,
                        // comments: post[i][j].comments,
                        comments: commentpost,
                        likes: post[i][j].likes,
                        content: post[i][j].content,
                        createdAt:post[i][j].createdAt
                    }
                    postArr.push(apost)
                }
            }
           
        }
        var userPost = await Post.find({user: req.user._id})
        for(let i = 0; i < userPost.length; i++){
            var commentpost = await Comment.find({post:userPost[i]._id})
            if (userPost[i].length != 0) {
                    var apost = {
                        username: req.user.username,
                        avatarStatus: req.user.avatarStatus,
                        userid: req.user._id,
                        imageStatus: userPost[i].imageStatus,
                        postid:userPost[i]._id,
                        comments: commentpost,
                        likes: userPost[i].likes,
                        content: userPost[i].content,
                        createdAt:userPost[i].createdAt
                    }
                    postArr.push(apost)
            }
           
        }

        var friendArr = await Promise.all(req.user.friends.map(friend => User.findById(friend.receiver)))
        // console.log(friendArr)
        const post3 = postArr.sort((a,b) => b.createdAt - a.createdAt)
        res.render('newsfeed', {postArr, friendArr, user: req.user})
    } catch(e) {
        res.status(500).send()
        console.log(e)
    }
})


module.exports = router