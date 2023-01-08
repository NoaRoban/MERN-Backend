//here we writes all the logic of our post
import Post from '../models/post_model'
import ResCtrl from '../common/ResponseCtrl'
import ReqCtrl from '../common/RequestCtrl'

/*const getAllPostsEvent = async(req: ReqCtrl) =>{
    console.log("")
    try{
        const posts = await Post.find()
        return {status: 'OK', data: posts}
    }catch(err){
        return {status: 'FAIL', data: ""}
    }
}*/

const getAllPosts = async(req:ReqCtrl) => {
    console.log('the req is:   '+req)
    try{
        let posts = {}
        if(req.userId == null){  
            posts = await Post.find()
        }else{
            posts = await Post.find({'userId':req.userId})
            console.log({'userId':req.userId})
        }
        return new ResCtrl(posts, req.userId,null)
    }catch(err){
        return new ResCtrl(null, req.userId, new ErrCtrl(400, err.message))
    }
}

const getPostById = async (req:ReqCtrl)=>{
    try{
        const posts = await Post.findById(req.postId)
        return new ResCtrl(posts, req.userId,null)
    }catch(err){
        return new ResCtrl(null, req.userId, new ErrCtrl(400, err.message))
    }
}

const addNewPost = async(req:ReqCtrl)=>{
    const post = new Post({//creating obj and get it from mongoose
        message: req.body.message,
        sender: req.userId
    })

    try{
        const newPost = await post.save()
        console.log("save post in DB")
        return new ResCtrl(newPost, req.userId,null)
    }catch(err){
        console.log("failed to save post in DB")
        return new ResCtrl(null,req.userId, new ErrCtrl(400,err.message))
    }
}

const putPostById = async(req:ReqCtrl)=>{
    try{
        const filter = {_id: req.postId}
        const update = {$set: {message: req.body.message, sender: req.body.sender}}
        const postToUpdate = await Post.findByIdAndUpdate(filter,update ,{new: true})
        console.log('this is the new updated message: ' + postToUpdate.message)
        console.log('this is the new updated sender: ' + postToUpdate.sender)
        return new ResCtrl(postToUpdate, req.userId,null)
    }catch(err){
        console.log("failed to update post in DB")
        return new ResCtrl(null,req.userId, new ErrCtrl(400,err.message))
    }
}

export = {
    //getAllPostsEvent,
    getAllPosts, 
    addNewPost,
    getPostById,
    putPostById
}
