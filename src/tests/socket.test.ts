import server from "../app"
import mongoose from "mongoose"
import Client, { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

import request from "supertest"
import Post from '../models/post_model'
import User from '../models/user_model'

const userEmail = "user1@gmail.com"
const userPassword = "12345"
const userName = 'Name1'

const userEmail2 = "user2@gmail.com"
const userPassword2 = "12345"
const userName2 = 'Name2'

let postId = null;
const messageFromClient1 = 'This is a message from client1'

const messageExample = 'This is a new post message example'
const messageExample2 = 'This is a new post message example2'

type Client = {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    accessToken: string,
    id: string
}

let client1: Client
let client2: Client

function clientSocketConnect(clientSocket): Promise<string>{
    return new Promise((resolve)=>{
        clientSocket.on("connect", ()=>{
            resolve("1")
        });
    })
}

const connectUser = async (userEmail, userPassword, userName)=>{
    const response1= await request(server).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name" : userName
    })
    const userId = response1.body._id
    const response = await request(server).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    })
    const token= response.body.accessToken

    //after we have the access token we can to create the client
    /*const socket = Client('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    })*/
    const socket = io(server)
    socket.close()
    await clientSocketConnect(socket)
    const client = {socket: socket,accessToken: token, id: userId}
    return client
}

describe("Socket tests", () => {
    jest.setTimeout(35000)
    beforeAll(async() => {
        await Post.remove()
        await User.remove()
        client1 = await connectUser(userEmail, userPassword ,userName)
        client2 = await connectUser(userEmail2, userPassword2,userName2)
    });
    
    afterAll(() => {
        client1.socket.close()
        client2.socket.close()
        server.close()
        mongoose.connection.close()
    });
 
    test("should work", (done) => {
        client1.socket.once("echo:echo_res",(arg) => {
           console.log("echo:echo")
           expect(arg.msg).toBe('hello')
           done();
       })
       client1.socket.emit("echo:echo", {'msg':'hello'})
    });
    test("Add new post test", (done) => {
        client1.socket.once('post:add_new',(arg) => {
            expect(arg.sender).toEqual(client1.id)
            expect(arg.message).toEqual(messageExample)
            console.log('this is the sender: '+ arg.sender)
            postId= arg._id
            done()
        })
        client1.socket.emit("post:add_new", {message:messageExample })
    })

   test("Get all posts test", (done) => {
        client1.socket.once('post:get_all',(arg) => {
            console.log("on any" + arg)
            expect(arg[0].message).toEqual(messageExample)
            done()
        })
        client1.socket.emit("post:get_all")
    })

    test("Post get by sender", (done) => {
        client2.socket.once("post:get_post_by_sender", (arg) => {
          expect(arg[0].message).toEqual(messageExample);
          expect(arg[0].sender).toEqual(client1.id);
          done();
        });
        client2.socket.emit("post:get_post_by_sender", { sender: client1.id });
    });

    test("get post by id test", (done) => {
        client2.socket.once("post:get_post_by_id", (arg) => {
          expect(arg.message).toEqual(messageExample);
          expect(arg.sender).toEqual(client1.id);
          done();
        });
        client2.socket.emit("post:get_post_by_id", { id: postId });
    });

    test("update post test", (done) => {
        client1.socket.once("post:put_post_by_id", (arg) => {
          expect(arg.message).toEqual(messageExample2);
          expect(arg.sender).toEqual(client1.id);
          done();
        });
        client1.socket.emit("post:put_post_by_id", { id: postId, message: messageExample2 });
      });

    test("Test chat messages client1 to client2", (done) => {
        const message = 'hi client2 from client1'
        client2.socket.once('chat:message', (args) => {
            expect(args.to).toBe(client2.id)
            expect(args.message).toBe(message)
            expect(args.from).toBe(client1.id)
            done()
        })
        client1.socket.emit("chat:send_message",{to: client2.id, message: message})
    })

    test("Test chat messages client2 to client1", (done) => {
        const message = 'hi client1 from client2'
        client1.socket.once('chat:message', (args) => {
            expect(args.to).toBe(client1.id)
            expect(args.message).toBe(message)
            expect(args.from).toBe(client2.id)
            done()
        })
        client2.socket.emit("chat:send_message",{to: client1.id, message: message})
    })

    test("Test get messages", (done) => {
        client1.socket.once("chat:get_user_messages", (args)=>{
            expect(args).not.toBe(null)
            done()
        })
        client1.socket.emit("chat:get_user_messages", {"id": client2.id})
    })
})