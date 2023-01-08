import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import Chat_model from "../models/chat_model"
export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    // {'to': destination user id,
    //  'meassage': message to send}

    const sendMessage = async(payload) => {
        console.log('chat:send_message')
        /*const to = payload.to
        const message = payload.message
        const from = socket.data.user*/
        const message = new Chat_model({
            to: payload.to,
            from: socket.data.user,
            message: payload.message
        })
        await message.save()
        io.to(message.to).emit("chat:message", {'to':message.to, 'from': message.from, 'message': message.message})
    }

    const getUserMessages = async (payload) => {
        const messagesFrom = await Chat_model.find({from: payload.id, to: socket.data.user})
        const messagesTo = await Chat_model.find({to: payload.id, from: socket.data.user})
        const messages = messagesFrom.concat(messagesTo)

        socket.emit("chat:get_user_messages", messages)
    }
    console.log('register chat handlers')
    socket.on("chat:send_message", sendMessage)
    socket.on("chat:get_user_messages", getUserMessages)

}
 