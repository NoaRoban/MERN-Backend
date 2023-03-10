//here we writes all the logic of our post
import Post from '../models/post_model'
import ResCtrl from '../common/ResponseCtrl'
import ReqCtrl from '../common/RequestCtrl'
import User from '../models/user_model'
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

const getAllPostByUserId = async (req:ReqCtrl)=>{
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
}

const addNewPost = async(req:ReqCtrl)=>{
    try{
        const { userId, message, imageUrl } = req.body;
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return new ResCtrl(null, req.userId, new ErrCtrl(400,'Failed to create post - user id does not exists' ))
        }
        const post = new Post({
            message,
            imageUrl,
            userId: currentUser._id
        });

        const userPosts = currentUser.posts || [];

        userPosts.push(post.id);
        currentUser.posts = userPosts;

        const [newPost] = await Promise.all([post.save(), currentUser.save()]);
        return new ResCtrl(newPost, req.userId,null)
    } catch (err) {
        console.log(err)
        return new ResCtrl(null, req.userId, new ErrCtrl(400,'fail adding new post to db' + err))

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
        const { imageUrl, message, userId } = req.body;
        const postId = req.postId;

        const post = await Post.findById(postId);
        if (userId !== post.userId.toString()) {
            return new ResCtrl(null, req.userId,new ErrCtrl(400,"Error, user is not authorized to change this post."))
        }

        post.$set({
            image: imageUrl || post.imageUrl,
            text: message || post.message,
        });

       // await post.save();
        const filter = {_id: req.postId}
        const update = {$set: {message: message, sender: imageUrl}}
        const postToUpdate = await Post.findByIdAndUpdate(filter,update ,{new: true})
        console.log('the updated post: ' + postToUpdate.message + '    '+ postToUpdate.imageUrl)
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
    getAllPostByUserId
}
