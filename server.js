const express=require('express')
const app=express()
const ejs=require("ejs")
const path=require('path')
const expressLayouts=require("express-ejs-layouts")
const { dirname } = require('path')
app.use(express.static('public'))
app.get('/',(req,res)=>{
    res.render('home')
})

// set template engine
app.use(expressLayouts)


const port=process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})