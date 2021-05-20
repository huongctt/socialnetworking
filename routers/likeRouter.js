const express = require ('express')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Post = require('../models/post.js')
const Like = require('../models/like.js')
const Notification = require('../models/notification.js')


const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/likes/create', auth, async (req, res) => {
    // console.log(req.body)
    try {
        let post = await Post.findById(req.body.post)

    if(post) {
        var prelike = await Like.findOne({userid: req.user._id, post: post._id})
        if (!prelike){
            const like = new Like({
                ...req.body,  
                userid: req.user._id,
                // username: req.user.username,
                // avatarurl: req.user.avatarurl
            })
            await like.save()
            post.likes.push(like)
            await post.save() 
            var prenoti = await Notification.findOne({action: 'like',post: post._id})
            prenoti.users.push(req.user)
            await prenoti.save()
            res.status(201).send({
                message: "Like successfully"
            })
        
        }else {
            res.status(201).send({
                message: "You liked this post before"
            })
        }   

        

    }else {
        throw new Error()
    }


        
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router