const express = require ('express')
const cookies = require("cookie-parser");
const multer = require('multer')
const sharp = require('sharp')
const bodyParser = require("body-parser")  

const User = require('../models/user.js')
const Friend = require('../models/friend.js')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const Like = require('../models/like.js')
const auth = require('../middleware/auth.js')

const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookies());


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

//register
router.post('/users/register', async (req, res) => {
    // console.log(req.body)
    // const user = new User(req.body)
    const user = new User ({
        ...req.body,
        avatarurl: "/images/default-avatar.png"
    })
    try {
        
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('authToken', token,{httpOnly: true, maxAge: 3600000})
        // console.log(user)
        // res.status(201).send({user, token})
        res.redirect('/newsfeed')
    } catch (e) {
        res.status(400).send(e)
    }

})

//login
router.post('/users/login', async (req, res) => {
    try {
        // console.log(req.body)
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.cookie('authToken', token,{httpOnly: true, maxAge: 3600000})
        
        // res.send({user,token})
        res.redirect('/newsfeed')
    } catch(e) {
        res.status(400).send()
        console.log(e)
    }
})

router.get('/users/editprofile', auth, async(req,res) => {
    const match = {friends : true }
    await req.user.populate({
        path: 'friends',
         match: match
                
    }).execPopulate();
    var friendArr = await Promise.all(req.user.friends.map(friend => User.findById(friend.receiver)))
    res.render('editprofile', {thisuser: req.user, friendArr, user: req.user})
})

router.post('/users/edit', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    // console.log(req.body)
    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.redirect('back')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/uploadAvatar',auth, upload.single('avatar'), async (req, res) => {
    // console.log("change Avatar")
    const buffer = await sharp(req.file.buffer).resize({width:400, height:400}).png().toBuffer()
    req.user.avatar = buffer
    req.user.avatarurl = '/users/' +req.user._id +'/avatar'
    await req.user.save()
    // console.log(req.user)
    var link = '/users/' +req.user._id
    res.redirect(link)
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }else {
            res.set('Content-Type', 'image/png')
            res.send(user.avatar)
        }

    } catch(e) {
        res.status(404).send()
        console.log(e)
    }
})



router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        console.log("ok")
        // res.status(200).send()
        res.redirect('')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logout2', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        // res.status(200).send()
        res.redirect('../login')
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/users/:id',auth,  async (req, res) => {
    try {
        const _id = req.params.id 
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }else {
            const match = {friends : true }
            await user.populate({
                path: 'friends',
                match: match
                
            }).execPopulate();
            var friendArr = await Promise.all(user.friends.map(friend => User.findById(friend.receiver)))
            var postArr = await Post.find({user: user})
            if(postArr.length!= 0){
                const post3 = postArr.sort((a,b) => b.createdAt - a.createdAt)
                for(var i = 0; i < postArr.length; i++){
                    await postArr[i].populate({
                        path:'comments'
                    }).execPopulate()
                    if(postArr[i].comments.length!=0){
                        for(var j = 0; j < postArr[i].comments.length; j++){
                            await postArr[i].comments[j].populate({
                                path:'userid'
                            }).execPopulate()
                            // console.log("ok")
                        }
                    }
                }
            }
            var likeArr = []
            for(var k = 0; k < postArr.length; k++) {
                var flag = false;
                // console.log('post: ',postArr[k]._id)
                var like = await Like.findOne({userid:req.user._id, post: postArr[k]._id})
                if (like){
                    flag = true
                }
                likeArr.push(flag)
            }
            //friend status
            var status = 0
            var friend = await Friend.findOne({requester: req.user._id, receiver: user._id})
            if(friend) {
                status = friend.status
            }
            
            res.render('personwall', {thisuser: user, friendArr, postArr, user: req.user, status, likeArr})
        } 
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})






module.exports = router