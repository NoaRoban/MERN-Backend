const express = require('express') //import express package, load module to var
const app = express() //activate the constructor of exprees
//const port = 3000 // port that we are working on 
const dotenv = require('dotenv').config() //load the dotenv module to the var

const postRouter = require('./routes/post_route.js')

app.use('/post', postRouter)


app.listen(process.env.PORT, ()=>{ 
    console.log('Server started')
})