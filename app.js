require ('./models/mongoose')
const express = require('express')
const hbs = require('ejs')
const cookies = require("cookie-parser");
const path = require('path')
const bodyParser = require("body-parser") 
var $ = require('jquery');    
const userRouter = require('./routers/userRouter.js')
const friendRouter = require('./routers/friendRouter.js')
const postRouter = require('./routers/postRouter.js')
const commentRouter = require('./routers/commentRouter.js')


const app = express()
const port = process.env.PORT || 3000

const viewsPath = path.join(__dirname, './views')
const publicDirectoryPath = path.join(__dirname, './views')

app.use(express.json())
app.use(userRouter)
app.use(friendRouter)
app.use(postRouter)
app.use(commentRouter)
app.use(express.static(publicDirectoryPath))
app.use(cookies());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.set('views', viewsPath)

app.get('', (req,res) => {
    res.render('landing')
})



app.listen(port,() => {
    console.log('Server is on port: ' + port )
})
