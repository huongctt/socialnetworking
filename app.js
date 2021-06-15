require ('./models/mongoose')
const express = require('express')
const hbs = require('ejs')
const cookies = require("cookie-parser");
const path = require('path')
const bodyParser = require("body-parser") 
const socketio = require('socket.io')
const http = require('http')

const userRouter = require('./routers/userRouter.js')
const friendRouter = require('./routers/friendRouter.js')
const postRouter = require('./routers/postRouter.js')
const commentRouter = require('./routers/commentRouter.js')
const likeRouter = require('./routers/likeRouter.js')
const notificationRouter = require('./routers/notificationRouter.js')
const chatRouter = require('./routers/chatRouter.js')

const Chat = require('./models/chat.js')
const Message = require('./models/message.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT ||3000

const viewsPath = path.join(__dirname, './views')
const publicDirectoryPath = path.join(__dirname, './views')

app.use(express.json())
app.use(userRouter)
app.use(friendRouter)
app.use(postRouter)
app.use(commentRouter)
app.use(likeRouter)
app.use(notificationRouter)
app.use(chatRouter)
app.use(express.static(publicDirectoryPath))
app.use(cookies());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.set('views', viewsPath)

app.get('', (req,res) => {
    res.render('landing')
})
app.get('/login', (req,res) => {
    res.render('landing')
})

io.on('connection', (socket) => {
    console.log('New connection')
    
    socket.on('join', (commonChat, callback) =>{

        
        socket.join(commonChat)
        console.log('an user has joined')
    })

    socket.on('sendMessage', async (send, callback) => {
        // const send = {
        //     message, commonChat, sendid, receiveid
        // }
        const newmessage = new Message ({
            creator: send.sendid,
            content: send.message
        })
        await newmessage.save()
        let chat = await Chat.findByIdAndUpdate(send.commonChat, {
            $push: {messages: newmessage._id}
        });
        io.to(send.commonChat).emit('message', newmessage)
        callback()
    })

})

server.listen(port, () => {
    console.log('Server is up!')
})
