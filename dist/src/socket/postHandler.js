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
module.exports = (io, socket) => {
    const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield post_1.default.getAllPostsEvent();
        socket.emit('post:get_all', res);
    });
    const getPostById = (payload) => {
        // ...
    };
    const addNewPost = (payload) => {
        // ...
    };
    console.log('register echo handlers');
    socket.on("post:get_all", getAllPosts);
    socket.on("post:get_by_id", getPostById);
    socket.on("post:add_new", addNewPost);
};
//# sourceMappingURL=postHandler.js.map