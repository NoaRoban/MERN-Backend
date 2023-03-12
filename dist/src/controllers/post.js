"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
//here we writes all the logic of our post
const post_model_1 = __importDefault(require("../models/post_model"));
const ResponseCtrl_1 = __importDefault(require("../common/ResponseCtrl"));
const user_model_1 = __importDefault(require("../models/user_model"));
/*const getAllPostsEvent = async(req: ReqCtrl) =>{
    console.log("")
    try{
        const posts = await Post.find()
        return {status: 'OK', data: posts}
    }catch(err){
        return {status: 'FAIL', data: ""}
    }
}*/
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let posts = {};
    try {
        // if (req.body == null) {
        posts = yield post_model_1.default.find();
        res.status(200).send(posts);
        /*}
        else {

        console.log('userIddddddddddddddddddddd'+req.body.userId)
            posts = await Post.find({ 'userId': req.body.userId })
            res.status(200).send(posts)
        }*/
    }
    catch (err) {
        res.status(400).send({ 'err': "failed to get all posts from DB" });
    }
});
const getAllUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.aggregate([
            { $unwind: "$userId" },
            {
                $lookup: {
                    from: user_model_1.default.collection.name,
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
        ]);
        res.status(200).send(posts);
    }
    catch (err) {
        res.status(400).send({ err: "fail to get posts from db" });
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.findById(req.postId);
        return new ResponseCtrl_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, err.message));
    }
});
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
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    const text = req.body.text;
    const imageUrl = req.body.imageUrl;
    console.log('userId: ' + userId);
    console.log('text: ' + text);
    console.log('imageUrl: ' + imageUrl);
    const post = new post_model_1.default({
        text,
        imageUrl,
        userId: userId
    });
    try {
        const currentUser = yield user_model_1.default.findOne({ _id: userId });
        console.log('current user: ' + currentUser.id);
        if (!currentUser) {
            res.status(400).send({ 'error': 'Failed to create post - user id does not exists' });
        }
        const userPosts = currentUser.posts || [];
        userPosts.push(post.id);
        currentUser.posts = userPosts;
        const [newPost] = yield Promise.all([post.save(), currentUser.save()]);
        //return new ResCtrl(newPost, userId,null)
        res.status(200).send(newPost);
    }
    catch (err) {
        console.log(err);
        //return new ResCtrl(null, userId, new ErrCtrl(400,'fail adding new post to db' + err))
        res.status(400).send({ 'error': 'fail adding new post to db' });
    }
});
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
const updatePostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageUrl, text, userId } = req.body;
        const postId = req.postId;
        const post = yield post_model_1.default.findById(postId);
        if (userId !== post.userId.toString()) {
            return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, "Error, user is not authorized to change this post."));
        }
        post.$set({
            image: imageUrl || post.imageUrl,
            text: text || post.text,
        });
        // await post.save();
        const filter = { _id: req.postId };
        const update = { $set: { text: text, sender: imageUrl } };
        const postToUpdate = yield post_model_1.default.findByIdAndUpdate(filter, update, { new: true });
        console.log('the updated post: ' + postToUpdate.text + '    ' + postToUpdate.imageUrl);
        return new ResponseCtrl_1.default(postToUpdate, req.userId, null);
    }
    catch (err) {
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, "Error, user faild to update this post." + err));
    }
});
module.exports = {
    //getAllPostsEvent,
    getAllPosts,
    addNewPost,
    getPostById,
    updatePostById,
    //putPostById,
    getAllUserPosts
};
//# sourceMappingURL=post.js.map