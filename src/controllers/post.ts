//here we writes all the logic of our post
import Post from '../models/post_model'
import { Request,Response } from 'express'

const getAllPostsEvent = async() =>{
    console.log("")
    try{
        const posts = await Post.find()
        return {status: 'OK', data: posts}
    }catch(err){
        return {status: 'FAIL', data: ""}
    }
}

const getAllPosts = async(req:Request,res:Response) => {
    try{
        let posts = {}
        if(req.query.sender == null){  
            posts = await Post.find()
        }else{
            posts = await Post.find({'sender':req.query.sender})
            console.log({'sender':req.query.sender})
        }
        res.status(200).send(posts)
    }catch(err){
        res.status(400).send({'error':'fail to get posts from DB'})
    }
}

const getPostById = async (req:Request,res:Response)=>{
    console.log(req.params.id)
    try{
        const posts = await Post.findById(req.params.id)
        res.status(200).send(posts) 
    }catch(err){
        res.status(400).send({'error':"fail to get posts from db"})
    }
}

const addNewPost = async(req:Request,res:Response)=>{
    console.log(req.body)

    const post = new Post({//creating obj and get it from mongoose
        message: req.body.message,
        sender: req.body.sender
    })

    try{
        const newPost = await post.save()
        console.log("save post in DB")
        res.status(200).send(newPost)
    }catch(err){
        console.log("failed to save post in DB")
        res.status(400).send({'error':"failed to save post in DB"})
    }
}

const putPostById = async(req:Request,res:Response)=>{
    try{
        const postToUpdate = await Post.findByIdAndUpdate(req.params.id, req.body,{new: true})
        res.status(200).send(postToUpdate)
    }catch(err){
        console.log("failed to update post in DB")
        res.status(400).send({'error':"failed to update post in DB"})
    }
}

export = {
    getAllPostsEvent,
    getAllPosts, 
    addNewPost,
    getPostById,
    putPostById
}
