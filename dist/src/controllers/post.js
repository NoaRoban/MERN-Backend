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
const getAllPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('the req is:   ' + req);
    try {
        let posts = {};
        if (req.userId == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ 'userId': req.userId });
            console.log({ 'userId': req.userId });
        }
        return new ResponseCtrl_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, err.message));
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
const getAllPostByUserId = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield user_model_1.default.findById(userId);
        const postsByUserId = user.posts;
        const ids = yield post_model_1.default.findById(req.postId);
        const posts = yield post_model_1.default.find({
            _id: { $in: ids }
        });
        return new ResponseCtrl_1.default(posts, req.userId, null);
    }
    catch (err) {
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, err.message));
    }
});
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, message, imageUrl } = req.body;
        const currentUser = yield user_model_1.default.findById(userId);
        if (!currentUser) {
            return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, 'Failed to create post - user id does not exists'));
        }
        const post = new post_model_1.default({
            message,
            imageUrl,
            userId: currentUser._id
        });
        const userPosts = currentUser.posts || [];
        userPosts.push(post.id);
        currentUser.posts = userPosts;
        const [newPost] = yield Promise.all([post.save(), currentUser.save()]);
        return new ResponseCtrl_1.default(newPost, req.userId, null);
    }
    catch (err) {
        console.log(err);
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, 'fail adding new post to db' + err));
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
        const { imageUrl, message, userId } = req.body;
        const postId = req.postId;
        const post = yield post_model_1.default.findById(postId);
        if (userId !== post.userId.toString()) {
            return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, "Error, user is not authorized to change this post."));
        }
        post.$set({
            image: imageUrl || post.imageUrl,
            text: message || post.message,
        });
        // await post.save();
        const filter = { _id: req.postId };
        const update = { $set: { message: message, sender: imageUrl } };
        const postToUpdate = yield post_model_1.default.findByIdAndUpdate(filter, update, { new: true });
        console.log('the updated post: ' + postToUpdate.message + '    ' + postToUpdate.imageUrl);
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
    getAllPostByUserId
};
//# sourceMappingURL=post.js.map