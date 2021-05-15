
const mongoose = require ('mongoose')

mongoose.connect('mongodb://localhost:27017/social-networking2',{
    useNewUrlParser: true,
    useCreateIndex: true ,
    useUnifiedTopology: true,
    useFindAndModify: false
})