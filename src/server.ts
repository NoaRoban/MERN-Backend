//const port = 3000 // port that we are working on 
import dotenv from 'dotenv' //load the dotenv module to the var
if (process.env.NODE_ENV == 'test'){
    dotenv.config({ path: './.testenv' })
}else{
    dotenv.config()
}

//import express package, load module to var
import express from 'express' 
const app = express()//activate the constructor of exprees
import http from 'http';
const server = http.createServer(app);

import bodyParser from 'body-parser'

//analyze the request
app.use(bodyParser.urlencoded({extended:true, limit: '1mb'}))
app.use(bodyParser.json())

import mongoose from "mongoose"
mongoose.connect(process.env.DATABASE_URL) //,{useNewUrlParser:true})
const db = mongoose.connection
db.on('error',error=>{console.error(error)})
db.once('open',()=>{console.log('connected to mongo DB')})

app.use('/public',express.static('public'))
app.use('/uploads/', express.static('uploads'))

import authRouter from './routes/auth_route.js'
app.use('/auth',authRouter)

import postRouter from './routes/post_route.js'
app.use('/post',postRouter)

import studentRouter from './routes/student_route.js'
app.use('/student', studentRouter)

import fileRouter from './routes/file_route.js'
app.use('/file', fileRouter)

import userRouter from './routes/user_route.js'
app.use('/user', userRouter);

//swagger implemantation 
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

if (process.env.NODE_ENV == "development") {
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Dev 2022 REST API",
                version: "1.0.0",
                description: "REST server including authentication using JWT",
            },
            servers: [{url: "http://localhost:3000",},],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}
//end of swagger inplements
export = server