const express = require ('express')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const Notification = require('../models/notification.js')


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
        await req.user.populate({
            path: 'notifications'
            
        }).execPopulate();

        var prenoti = await Notification.findOne({action: 'comment',post: post._id})
        var flag = false;
        for(var j = 0; j < prenoti.users.length; j++){
            if(prenoti.users[j].equals(req.user._id)){
                flag = true
            }
        }
        if(!req.user._id.equals(post.user)){
            if(!flag) {
                console.log(flag)
                prenoti.users.push(req.user)
                await prenoti.save()
                req.user.notifications.push(prenoti)
                await req.user.save()
            }
        } else {
            if(!flag) {
                // console.log(flag)
                prenoti.users.push(req.user)
                await prenoti.save()
                
            }   
        } 
        prenoti.count = prenoti.count + 1
        await prenoti.save()
        // console.log(prenoti)
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
        console.log(e)
    }
})


module.exports = router