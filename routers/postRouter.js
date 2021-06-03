const express = require ('express')
const bodyParser = require("body-parser")  
const multer = require('multer')
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Friend = require('../models/friend.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const Like = require('../models/like.js')
const Notification = require('../models/notification.js')

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
        var noti1 = new Notification({
            action: 'comment',
            post: post._id
        })
        await noti1.save()
        req.user.notifications.push(noti1)
        await req.user.save()
        var noti2 = new Notification({
            action: 'like',
            post: post._id
        })
        await noti2.save()
        req.user.notifications.push(noti2)
        await req.user.save()
        
        res.redirect('back')
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

router.get('/posts/:id', auth,  async (req, res) => {
    try {
        var post = await Post.findById(req.params.id)
        await post.populate({
            path: 'user'
            
        }).execPopulate();
        await post.populate({
            path: 'comments'
            
        }).execPopulate();
        if(post.comments.length!=0){
            
            for(var k = 0; k < post.comments.length; k++){
                await post.comments[k].populate({
                    path:'userid'
                }).execPopulate()
            }   
        }
        res.render('singlepost', {post: post, user: req.user})
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
                    for (let j = 0; j < post[i].length; j++){
                        await post[i][j].populate({
                            path: 'user'
                            
                        }).execPopulate();
                        await post[i][j].populate({
                            path: 'comments'
                            
                        }).execPopulate();
                        if(post[i][j].comments.length!=0){
                            
                            for(var k = 0; k < post[i][j].comments.length; k++){
                                await post[i][j].comments[k].populate({
                                    path:'userid'
                                }).execPopulate()
                            }   
                        }
                        postArr.push(post[i][j])
                    }
                }
               
            
        }

        
           
        
        var userPost = await Post.find({user: req.user._id})
        if(userPost.length!=0) {
            for(let i = 0; i < userPost.length; i++){
                await userPost[i].populate({
                    path:'comments'
                }).execPopulate()
                await userPost[i].populate({
                    path: 'user'
                    
                }).execPopulate();
                
                for(var j = 0; j < userPost[i].comments.length; j++){
                    await userPost[i].comments[j].populate({
                        path:'userid'
                    }).execPopulate()
                        // console.log("ok")
                }
                
           
                postArr.push(userPost[i])
               
            }
        }
        
        
        var friendArr = await Promise.all(req.user.friends.map(friend => User.findById(friend.receiver)))
        // console.log(friendArr)
        const post3 = postArr.sort((a,b) => b.createdAt - a.createdAt)

        var likeArr = [];
        for(var k = 0; k < postArr.length; k++) {
            var flag = false;
            var like = await Like.findOne({userid:req.user._id, post: postArr[k]._id})
            if (like){
                flag = true
            }
            likeArr.push(flag)
        }
        res.render('newsfeed', {postArr, friendArr, user: req.user, likeArr})
        
    } catch(e) {
        res.status(500).send()
        console.log(e)
    }
})

module.exports = router