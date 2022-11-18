const express = require('express') //import express package, load module to var
const app = express() //activate the constructor of exprees
//const port = 3000 // port that we are working on 
const dotenv = require('dotenv').config() //load the dotenv module to the var
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
const db= mongoose.connection


mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true})

db.on('error',error=>{console.error(error)}) // if we cant to connect to DB
db.once('open',()=>{console.log('Connected to mongo DB')})

//analyze the request
app.use(bodyParser.urlencoded({extended: true, limit:'1mb'}))
app.use(bodyParser.json())

const postRouter = require('./routes/post_route.js')

app.use('/post', postRouter)


module.exports = app