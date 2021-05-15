const express = require ('express')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')


const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/comments/create', auth, async (req, res) => {
    // console.log(req.body)
    try {
        let post = await Post.findById(req.body.post)

    if(post) {
        const comment = new Comment({
            ...req.body,  
            userid: req.user._id,
            // username: req.user.username,
            // avatarurl: req.user.avatarurl
        })
        await comment.save()
        post.comments.push(comment)
        await post.save()  
        // console.log(comment)      
        res.status(201).send({
            comment,
            username:req.user.username,
            avatarurl: req.user.avatarurl
        })

    }else {
        throw new Error()
    }


        
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router