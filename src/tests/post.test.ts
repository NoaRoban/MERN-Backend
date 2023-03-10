import request from "supertest"
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/post_model'
import User from '../models/user_model'

const newPostMessage = 'This is the new post message'
let newPostSender = ''
let newPostId = ''
const newPostMessageUpdated = 'This is the updated message'

const userEmail = "user1@gmail.com"
const userPassword = "12345"
const userName = "Noa"
let accessToken = ''

beforeAll(async ()=>{
    await Post.remove()
    await User.remove()
    const res= await request(app).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name" : userName,
    })
    newPostSender = res.body._id
    console.log('the idddddddddddd: '+ newPostSender)
})

async function loginUser(){
    const response = await request(app).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    })
    accessToken= response.body.accessToken
}

beforeEach(async ()=>{
    await loginUser()
})

afterAll(async ()=>{
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe("Posts Tests", ()=>{
    jest.setTimeout(30000)
    test("add new post", async()=>{
        const response = await request(app).post('/post').set('Authorization', 'JWT '+ accessToken).send({
            "message": newPostMessage,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.userId).toEqual(newPostSender)
        newPostId = response.body.post._id
        console.log('the new post id = '+ newPostId)
    })

    test("get all posts", async()=>{
        const response = await request(app).get('/post').set('Authorization', 'JWT '+ accessToken)
        expect(response.statusCode).toEqual(200)
        try{
            expect(response.body.post[0].message).toEqual(newPostMessage)
            expect(response.body.post[0].userId).toEqual(newPostSender)
        }
        catch{
            console.log('DB is empty')
        }
    })

   test("get all posts containing given text in post message", async()=>{
        const response = await request(app).get('/post?message=new').set('Authorization', 'JWT ' + accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post[0].message).toEqual(newPostMessage)
        expect(response.body.post[0].userId).toEqual(newPostSender)
    })

    test("get post by Id", async()=>{
        const response = await request(app).get('/post/'+newPostId).set('Authorization', 'JWT '+ accessToken)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.userId).toEqual(newPostSender)
    })

    test("get post by wrong Id fails", async()=>{
        const response = await request(app).get('/post/1235').set('Authorization', 'JWT '+ accessToken)
        expect(response.statusCode).toEqual(400)
    })

    test("get post by sender", async()=>{
        const response = await request(app).get('/post?sender='+newPostSender).set('Authorization', 'JWT '+ accessToken)
        console.log('the sender is '+ response.body.post[0].userId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post[0].message).toEqual(newPostMessage)
    })

    test("update post by ID", async()=>{
        //here we update the sender also
        let response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT '+ accessToken).send({
            'message': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.userId).toEqual(newPostSender)
        
        //here we update only the message
        response = await request(app).put('/post/'+newPostId).set('Authorization', 'JWT '+ accessToken).send({message: newPostMessageUpdated})
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.userId).toEqual(newPostSender)

        console.log('the sender is '+ response.body.post.userId)
        console.log('the updated message is '+ response.body.post.message)

        response = await request(app).put('/post/12345').set('Authorization', 'JWT ' + accessToken)
        .send({
            'message': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(400)

        response = await request(app).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
        .send({
            "message": newPostMessageUpdated,
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessageUpdated)
        expect(response.body.post.userId).toEqual(newPostSender)
    })

    /*test("update post by wrong id", async()=>{
        //if the ID does not exist then we need to add a new post
        let response = await request(app).put('/post/1538').set('Authorization', 'JWT ' + accessToken).send({
            'message': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(400)
        //create a new post
        const newPostSenderWithNewId= '1234'
        response = await request(app).post('/post').set('Authorization', 'JWT ' + accessToken).send({
            'message': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.userId).toEqual(newPostSenderWithNewId)
    })*/
})


