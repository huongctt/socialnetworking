const express = require ('express')
const bodyParser = require("body-parser")  

const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Friend = require('../models/friend.js')
const Post = require('../models/post.js')


const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));
//create post
router.post('/posts/create', auth, async (req, res) => {
    // console.log(req.body)
    const post = new Post({
        ...req.body,  
        user: req.user._id
    })

    try {
        await post.save()
        res.status(201).send(post)
    } catch (e) {
        res.status(400).send(e)
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
                    var apost = {
                        username: user.username,
                        userid: user._id,
                        postid:post[i][j]._id,
                        comments: post[i][j].comments,
                        likes: post[i][j].likes,
                        content: post[i][j].content,
                        createdAt:post[i][j].createdAt
                    }
                    postArr.push(apost)
                }
            }
           
        }
        var friendArr = await Promise.all(req.user.friends.map(friend => User.findById(friend.receiver)))
        // console.log(friendArr)
        const post3 = postArr.sort((a,b) => b.createdAt - a.createdAt)
        res.render('newsfeed', {postArr, friendArr})
    } catch(e) {
        res.status(500).send()
        console.log(e)
    }
})


// router.get('/newsfeed', auth,  async (req, res) => {
//     const match = {friends : true }
//     try {
//         await req.user.populate({
//             path: 'friends',
//             match: match
            
//         }).execPopulate();
//         // res.send(req.user.friends)

//         var postArr = await Promise.all(req.user.friends.map(async (friend) => {

//             var post = await Post.find({user: friend.receiver})
//             if (post.length!=0){
//                 var user = await User.findById(post[0].user)
//                 post.map((apost) => {
//                     apost.usernameee = user.username
                    
//                     console.log(apost)
//                     return apost
//                 });
//                 console.log("1")
//             }
//             return post
//         }
//         ))
        
//         res.send(postArr)
//         console.log("2")
//         //console.log(post2)
         
        
//     } catch (e) {
//         console.log(e)
//         res.status(500).send(e)
//     }
// })


module.exports = router