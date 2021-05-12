const express = require ('express')
const User = require('../models/user.js')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const cookies = require("cookie-parser");
const multer = require('multer')
const sharp = require('sharp')

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
    console.log(req.body)
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.cookie('authToken', token,{httpOnly: true, maxAge: 3600000})
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

//personal wall
router.get('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id 
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }else {
            res.send(user)
        } 
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})
router.post('/users/uploadAvatar',auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp(req.file.buffer).resize({width:400, height:400}).png().toBuffer()
    req.user.avatar = buffer
    req.user.avatarStatus = true
    await req.user.save()
    res.send()
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





router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'bio', 'password','avatarStatus']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user)
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()

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


module.exports = router