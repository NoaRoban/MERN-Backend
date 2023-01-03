import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
    // {'to': destination user id,
    //  'meassage': message to send}

    const sendMessage = (payload) => {
        console.log('chat:send_message')
        const to = payload.to
        const message = payload.message
        const from = socket.data.user

        io.to(to).emit("chat:message", {'to':to, 'from': from, 'message': message})
    }
    console.log('register chat handlers')
    socket.on("chat:send_message", sendMessage)

}
 