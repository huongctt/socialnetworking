const express = require ('express')
const User = require('../models/user.js')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const cookies = require("cookie-parser");
const { render } = require('ejs');

const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookies());


router.post('/users/register', async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/users/login', async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        // res.cookie('authToken', token,{httpOnly: true, maxAge: 3600000})
        
        res.send({user,token})
        // res.redirect('/newsfeed')
    } catch(e) {
        res.status(400).send()
        console.log(e)
    }
})
router.get('/nhappost',auth, async (req, res) => {
    try {
        res.render('nhappost')
    } catch (e) {
        res.status(500).send()
        console.log(e)
    }
})

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
router.get('/newsfeed/ok',auth,  async (req, res) => {
    try {
        console.log('Cookies: ', req.cookies.authToken)
        console.log(req.user)
        res.render('newsfeed')
    } catch(e) {
        res.status(400).send()
    }
})





router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'bio', 'password']
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