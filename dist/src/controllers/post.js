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
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const post = new post_model_1.default({
        message: req.body.message,
        sender: req.userId
    });
    try {
        const newPost = yield post.save();
        console.log("save post in DB");
        return new ResponseCtrl_1.default(newPost, req.userId, null);
    }
    catch (err) {
        console.log("failed to save post in DB");
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, err.message));
    }
});
const putPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = { _id: req.postId };
        const update = { $set: { message: req.body.message, sender: req.body.sender } };
        const postToUpdate = yield post_model_1.default.findByIdAndUpdate(filter, update, { new: true });
        console.log('this is the new updated message: ' + postToUpdate.message);
        console.log('this is the new updated sender: ' + postToUpdate.sender);
        return new ResponseCtrl_1.default(postToUpdate, req.userId, null);
    }
    catch (err) {
        console.log("failed to update post in DB");
        return new ResponseCtrl_1.default(null, req.userId, new ErrCtrl(400, err.message));
    }
});
module.exports = {
    //getAllPostsEvent,
    getAllPosts,
    addNewPost,
    getPostById,
    putPostById
};
//# sourceMappingURL=post.js.map