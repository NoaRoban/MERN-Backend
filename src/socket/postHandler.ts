import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import postController from "../controllers/post"
export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const getAllPosts = async() => {// get all post handler
        const res = await postController.getAllPostsEvent()
        socket.emit('post:get_all', res)
    }
 
    const getPostById = (payload) => {
        // ...
    }

    const addNewPost = (payload) => {
        // ...
    }
    console.log('register echo handlers')
    socket.on("post:get_all", getAllPosts)
    socket.on("post:get_by_id", getPostById)
    socket.on("post:add_new", addNewPost)

}
 