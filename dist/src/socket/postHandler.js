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
const post_1 = __importDefault(require("../controllers/post"));
const RequestCtrl_1 = __importDefault(require("../common/RequestCtrl"));
module.exports = (io, socket) => {
    /*const getAllPosts = async(payload: any) => {// get all post handler
        try{
            const res = await postController.getAllPosts(new ReqCtrl(payload, socket.data.user, null ),new Response)
            socket.emit('post:get_all', res.body)
        }catch(err){
            socket.emit('post:get_all',{'status':'falied'})
        }
    }*/
    const getPostById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_1.default.getPostById(new RequestCtrl_1.default(payload, socket.data.user, payload.id));
            socket.emit('post:get_post_by_id', res.body);
        }
        catch (err) {
            socket.emit('post:get_post_by_id', { 'status': 'falied' });
        }
    });
    const addNewPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //const res = await postController.addNewPost(new ReqCtrl(payload,socket.data.user,null))
            //socket.emit('post:add_new', res.body)
        }
        catch (err) {
            socket.emit('post:add_new', { 'status': 'falied' });
        }
    });
    /*const putPostById = async(payload: any) => {
        try{
            const res = await postController.putPostById(new ReqCtrl(payload,socket.data.user,payload.id))
            socket.emit('post:put_post_by_id', res.body)
        }catch(err){
            socket.emit('post:put_post_by_id',{'status':'falied'})
        }
    }*/
    const getPostBySender = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //const res = await postController.getAllPosts(new ReqCtrl(payload,socket.data.user,payload.sender))
            //socket.emit('post:get_post_by_sender', res.body)
        }
        catch (err) {
            socket.emit('post:get_post_by_sender', { 'status': 'falied' });
        }
    });
    console.log('register echo handlers');
    //socket.on("post:get_all", getAllPosts)
    socket.on("post:get_post_by_id", getPostById);
    //socket.on("post:add_new", addNewPost)
    //socket.on("post:put_post_by_id", putPostById)
    socket.on("post:get_post_by_sender", getPostBySender);
};
//# sourceMappingURL=postHandler.js.map