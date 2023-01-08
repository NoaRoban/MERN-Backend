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
const chat_model_1 = __importDefault(require("../models/chat_model"));
module.exports = (io, socket) => {
    // {'to': destination user id,
    //  'meassage': message to send}
    const sendMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('chat:send_message');
        /*const to = payload.to
        const message = payload.message
        const from = socket.data.user*/
        const message = new chat_model_1.default({
            to: payload.to,
            from: socket.data.user,
            message: payload.message
        });
        yield message.save();
        io.to(message.to).emit("chat:message", { 'to': message.to, 'from': message.from, 'message': message.message });
    });
    const getUserMessages = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const messagesFrom = yield chat_model_1.default.find({ from: payload.id, to: socket.data.user });
        const messagesTo = yield chat_model_1.default.find({ to: payload.id, from: socket.data.user });
        const messages = messagesFrom.concat(messagesTo);
        socket.emit("chat:get_user_messages", messages);
    });
    console.log('register chat handlers');
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get_user_messages", getUserMessages);
};
//# sourceMappingURL=chatHandler.js.map