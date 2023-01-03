// import express from 'express'
// const app = express() //creating app
//import http from 'http' //ask for http
//const server = http.createServer(app) //creating server with express app
/*import { Server } from "socket.io" //here we get server from socket.io
const io = new Server(server) //constructor

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
    console.log('user disconnected');
    });
});

server.listen(3000, () => {
 console.log('listening on *:3000');
});*/

import { Server } from "socket.io"
import http from 'http';
//export an http funct  
import jwt from 'jsonwebtoken'
import postHandler from './socket/postHandler' 
import echoHandler from "./socket/echoHandler";
import chatHandler from "./socket/chatHandler";

export = (server: http.Server) => {
    const io = new Server(server)
    io.use(async (socket, next) => {
        let token = socket.handshake.auth.token;
        if(token == null) return next(new Error('Authentication error'))
        token = token.split(' ')[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err){
                return next(new Error('Authentication error'));
            } else{
                socket.data.user = user.id
                return next()
            }
        })
    });

    io.on('connection', async(socket) => {
        console.log('a user connected ' + socket.id);
        echoHandler(io, socket)
        postHandler(io, socket)
        chatHandler(io, socket)

        const userId = socket.data.user 
        await socket.join(userId)
    });
    return io
}
