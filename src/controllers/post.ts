//here we writes all the logic of our post
import Post from '../models/post_model'
import ResCtrl from '../common/ResponseCtrl'
import ReqCtrl from '../common/RequestCtrl'
import User from '../models/user_model'
import { Request ,Response } from "express";

/*const getAllPostsEvent = async(req: ReqCtrl) =>{
    console.log("")
    try{
        const posts = await Post.find()
        return {status: 'OK', data: posts}
    }catch(err){
        return {status: 'FAIL', data: ""}
    }
}*/

const getAllPosts = async(req: Request, res: Response) => {
    let posts = {}
    try {
       // if (req.body == null) {
            posts = await Post.find()
            res.status(200).send(posts)
        /*}
        else {

        console.log('userIddddddddddddddddddddd'+req.body.userId)
            posts = await Post.find({ 'userId': req.body.userId })
            res.status(200).send(posts)
        }*/
    } catch (err) {
        res.status(400).send({ 'err': "failed to get all posts from DB" })
    }
}

const getAllUserPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.aggregate(
            [
                { $unwind: "$userId" },
                {
                    $lookup: {
                        from: User.collection.name,
                        localField: "userId",
                        foreignField: "_id",
                        as: "owner"
                    }
                },
                { $unwind: '$owner' },
                {
                    $project: {
                        "owner.password": 0,
                        "owner.posts": 0,
                        "owner.createdAt": 0,
                        "owner.refresh_tokens": 0,
                        "owner.updatedAt": 0,
                        "owner.__v": 0,
                    }
                }
            ]
        );
        res.status(200).send(posts)
    } catch (err) {
        res.status(400).send({ err: "fail to get posts from db" })
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

/*const getAllPostByUserId = async (req:ReqCtrl)=>{
    try{
        const {userId} = req.body;
        const user = await User.findById(userId)
        const postsByUserId = user.posts
        const ids = await Post.findById(req.postId)
        const posts = await Post.find({
            _id: { $in: ids }
        });
        return new ResCtrl(posts, req.userId,null)
    }catch(err){
        return new ResCtrl(null, req.userId, new ErrCtrl(400, err.message))
    }
}*/

const addNewPost = async(req:Request,res: Response)=>{
    const userId = req.body.userId
    const text = req.body.text;
    const imageUrl = req.body.imageUrl;
    console.log('userId: '+userId)
    console.log('text: '+text)
    console.log('imageUrl: '+imageUrl)

    
    const post = new Post({
        text,
        imageUrl,
        userId: userId
    });
    try{    
        const currentUser = await User.findOne({_id: userId});
        console.log('current user: '+currentUser.id)
        if (!currentUser) {
            res.status(400).send({ 'error':'Failed to create post - user id does not exists'} )
        }
        const userPosts = currentUser.posts || [];
        userPosts.push(post.id);
        currentUser.posts = userPosts;
        const [newPost] = await Promise.all([post.save(), currentUser.save()]);
        //return new ResCtrl(newPost, userId,null)
        res.status(200).send(newPost)
    } catch (err) {
        console.log(err)
        //return new ResCtrl(null, userId, new ErrCtrl(400,'fail adding new post to db' + err))
        res.status(400).send({ 'error': 'fail adding new post to db' })

    }

    
}

/*const putPostById = async(req:ReqCtrl)=>{
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
}*/

const updatePostById = async (req: ReqCtrl) => {
    try {
        const { imageUrl, text, userId } = req.body;
        const postId = req.postId;

        const post = await Post.findById(postId);
        if (userId !== post.userId.toString()) {
            return new ResCtrl(null, req.userId,new ErrCtrl(400,"Error, user is not authorized to change this post."))
        }

        post.$set({
            image: imageUrl || post.imageUrl,
            text: text || post.text,
        });

       // await post.save();
        const filter = {_id: req.postId}
        const update = {$set: {text: text, sender: imageUrl}}
        const postToUpdate = await Post.findByIdAndUpdate(filter,update ,{new: true})
        console.log('the updated post: ' + postToUpdate.text + '    '+ postToUpdate.imageUrl)
        return new ResCtrl(postToUpdate, req.userId,null)

    } catch (err) {
        return new ResCtrl(null, req.userId,new ErrCtrl(400,"Error, user faild to update this post." +err))
    }
}

export = {
    //getAllPostsEvent,
    getAllPosts, 
    addNewPost,
    getPostById,
    updatePostById,
    //putPostById,
    getAllUserPosts
}
