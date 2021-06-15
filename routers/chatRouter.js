const express = require ('express')
const bodyParser = require("body-parser")  
const auth = require('../middleware/auth.js')
const User = require('../models/user.js')
const Message = require('../models/message.js')
const Chat = require('../models/chat.js')



const router = new express.Router()
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/chat/:id', auth, async (req,res) => {
    const send = req.user
    const recv = await User.findById(req.params.id)
    let commonChats = send.chats.filter(c => recv.chats.includes(c))
    let commonChat = commonChats[0]
    if (!commonChat) {
        //create new Chat
        commonChat = new Chat({ members: [send._id, recv._id], messages: [] })
        await commonChat.save()

        //update user collection

        let user = await User.findById(send._id)
        user.chats = [...user.chats, commonChat._id]
        await user.save()
        // console.log('send:', user)
      
        recv.chats = [...recv.chats, commonChat._id]
        await recv.save()
        // console.log('recv:', recv)
    } else {
        commonChat = await Chat.findById(commonChat)
    }
    //chat Arr
    await commonChat.populate({
        path: 'messages',
        
    }).execPopulate();
    //friend 
    const match = {friends : true }
    await req.user.populate({
        path: 'friends',
        match: match
        
    }).execPopulate();
    var friendArr = await Promise.all(req.user.friends.map(friend => User.findById(friend.receiver)))
    // console.log(commonChat)
    res.render('chat', {
        user: req.user,
        friendArr,
        sender: send,
        receiver: recv,
        commonChat
    })
})





module.exports = router