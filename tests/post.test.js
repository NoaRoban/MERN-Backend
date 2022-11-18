const request = require("supertest")
const app = require('../server')
const mongoose = require('mongoose')
const Post = require('../models/post_model')

const newPostMessage = 'This is the new post message'
const newPostSender = '999000'
let newPostId = ''
let updatePostMassage = 'My name is Noa'
beforeAll(async ()=>{
    await Post.remove()
})

afterAll(async ()=>{
    await Post.remove()
    mongoose.connection.close()
})

describe("Posts Tests", ()=>{
    test("add new post", async()=>{
        const response = await request(app).post('/post').send({
            "message":newPostMessage,
            "sender": newPostSender
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
        newPostId = response.body._id
    })

    test("get all posts", async()=>{
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
        try{
            expect(response.body[0].message).toEqual(newPostMessage)
            expect(response.body[0].sender).toEqual(newPostSender)
        }
        catch{
            console.log('DB is empty')
        }
    })

   test("get all posts containing given text in post message", async()=>{
        const response = await request(app).get('/post?message=new')
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
        expect(response.body[0].sender).toEqual(newPostSender)
    })

    test("get post by Id", async()=>{
        const response = await request(app).get('/post/'+newPostId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(newPostMessage)
        expect(response.body.sender).toEqual(newPostSender)
    })

    test("get post by sender", async()=>{
        const response = await request(app).get('/post?sender='+newPostSender)
        console.log('the sender is '+ response.body[0].sender)
        expect(response.statusCode).toEqual(200)
        expect(response.body[0].message).toEqual(newPostMessage)
    })

    test("update a post", async()=>{
        const response = await request(app).put('/post/'+newPostId).send({message: updatePostMassage})
        expect(response.statusCode).toEqual(200)
        expect(response.body.message).toEqual(updatePostMassage)
        expect(response.body.sender).toEqual(newPostSender)
        expect(response.body._id).toEqual(newPostId)

        console.log('the sender is '+ response.body.sender)
        console.log('the updated message is '+ response.body.message)
    })

})


