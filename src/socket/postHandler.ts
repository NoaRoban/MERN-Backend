import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import postController from "../controllers/post"
import ReqCtrl from "../common/RequestCtrl"

export = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>, 
            socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {

    const getAllPosts = async(payload: any) => {// get all post handler
        try{
            const res = await postController.getAllPosts(new ReqCtrl(payload, socket.data.user, null ))
            socket.emit('post:get_all', res.body)
        }catch(err){
            socket.emit('post:get_all',{'status':'falied'})
        }
    }
 
    const getPostById =async (payload: any) => {
        try{
            const res = await postController.getPostById(new ReqCtrl(payload,socket.data.user,payload.id))
            socket.emit('post:get_post_by_id', res.body)
        }catch(err){
            socket.emit('post:get_post_by_id',{'status':'falied'})
        }
    }

    const addNewPost = async(payload: any) => {
        try{
            const res = await postController.addNewPost(new ReqCtrl(payload,socket.data.user,null))
            socket.emit('post:add_new', res.body)
        }catch(err){
            socket.emit('post:add_new',{'status':'falied'})
        }
    }

    const putPostById = async(payload: any) => {
        try{
            const res = await postController.putPostById(new ReqCtrl(payload,socket.data.user,payload.id))
            socket.emit('post:put_post_by_id', res.body)
        }catch(err){
            socket.emit('post:put_post_by_id',{'status':'falied'})
        }
    }

    const getPostBySender = async(payload: any) => {
        try{
            const res = await postController.getAllPosts(new ReqCtrl(payload,socket.data.user,payload.sender))
            socket.emit('post:get_post_by_sender', res.body)
        }catch(err){
            socket.emit('post:get_post_by_sender',{'status':'falied'})
        }
    }    
    console.log('register echo handlers')
    socket.on("post:get_all", getAllPosts)
    socket.on("post:get_post_by_id", getPostById)
    socket.on("post:add_new", addNewPost)
    socket.on("post:put_post_by_id", putPostById)
    socket.on("post:get_post_by_sender", getPostBySender)

}
 