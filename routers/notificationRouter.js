const express = require ('express')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const Notification = require('../models/notification.js')


const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/notifications', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'notifications'
            
        }).execPopulate();
        for(var i = 0; i <req.user.notifications.length; i++) {
            await req.user.notifications[i].populate({
                path: 'users'
                
            }).execPopulate();
        }
        res.render('notification', {notifications: req.user.notifications, user: req.user})
    }catch (e) {
        res.send(e)
        console.log(e)
    }
})


module.exports = router