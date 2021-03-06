const express=require('express')
const app=express()
const ejs=require("ejs")
const path=require('path')
const expressLayouts=require("express-ejs-layouts")
const passport=require('passport')
const { dirname } = require('path')
const mongoose=require('mongoose')
const session = require('express-session')
const flash=require('express-flash')
const MongoDbStore =require('connect-mongo')(session)
const emitter=require('events')
//database cneection

const url="mongodb://127.0.0.1:27017/pizzas";
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const connection =mongoose.connection;
require('dotenv').config()
connection.once('open',()=>{
    console.log('Databse connected!!')
}).catch(res=>{
    console.log('connection failed...')
})





let mongoStore=new MongoDbStore({
    mongooseConnection:connection,
    collection:'session'
})

const eventEmitter=new emitter()

app.set('eventEmitter',eventEmitter)

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}//24hours
}))

//passport config 
const passInit=require('./app/config/passport')

passInit(passport)



app.use(passport.initialize());
app.use(passport.session())

app.use(flash())
app.use(express.static('public'))
//global middleware

app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()    
})
app.use(expressLayouts)



app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


require('./routes/web')(app)

const port=process.env.PORT || 3000
const server=app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

//Socket
const io =require('socket.io')(server)

io.on('connection',(socket)=>{
    //join
    
    socket.on('join',(roomName)=>{
        console.log(roomName)
        socket.join(roomName)
    })
})

eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
    console.log(data)
})
