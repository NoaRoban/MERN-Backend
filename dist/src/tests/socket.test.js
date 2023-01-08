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
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const supertest_1 = __importDefault(require("supertest"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const userEmail = "user1@gmail.com";
const userPassword = "12345";
const userEmail2 = "user2@gmail.com";
const userPassword2 = "12345";
let postId = null;
const messageFromClient1 = 'This is a message from client1';
const messageExample = 'This is a new post message example';
const messageExample2 = 'This is a new post message example2';
let client1;
let client2;
function clientSocketConnect(clientSocket) {
    return new Promise((resolve) => {
        clientSocket.on("connect", () => {
            resolve("1");
        });
    });
}
const connectUser = (userEmail, userPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const response1 = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword
    });
    const userId = response1.body._id;
    const response = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({
        "email": userEmail,
        "password": userPassword
    });
    const token = response.body.accessToken;
    //after we have the access token we can to create the client
    const socket = (0, socket_io_client_1.default)('http://localhost:' + process.env.PORT, {
        auth: {
            token: 'barrer ' + token
        }
    });
    yield clientSocketConnect(socket);
    const client = { socket: socket, accessToken: token, id: userId };
    return client;
});
describe("my awesome project", () => {
    jest.setTimeout(35000);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield post_model_1.default.remove();
        yield user_model_1.default.remove();
        client1 = yield connectUser(userEmail, userPassword);
        client2 = yield connectUser(userEmail2, userPassword2);
    }));
    afterAll(() => {
        client1.socket.close();
        client2.socket.close();
        app_1.default.close();
        mongoose_1.default.connection.close();
    });
    test("should work", (done) => {
        client1.socket.once("echo:echo_res", (arg) => {
            console.log("echo:echo");
            expect(arg.msg).toBe('hello');
            done();
        });
        client1.socket.emit("echo:echo", { 'msg': 'hello' });
    });
    test("Add new post test", (done) => {
        client1.socket.once('post:add_new', (arg) => {
            expect(arg.sender).toEqual(client1.id);
            expect(arg.message).toEqual(messageExample);
            console.log('this is the sender: ' + arg.sender);
            postId = arg._id;
            done();
        });
        client1.socket.emit("post:add_new", { message: messageExample });
    });
    test("Get all posts test", (done) => {
        client1.socket.once('post:get_all', (arg) => {
            console.log("on any" + arg);
            expect(arg[0].message).toEqual(messageExample);
            done();
        });
        client1.socket.emit("post:get_all");
    });
    test("Post get by sender", (done) => {
        client2.socket.once("post:get_post_by_sender", (arg) => {
            expect(arg[0].message).toEqual(messageExample);
            expect(arg[0].sender).toEqual(client1.id);
            done();
        });
        client2.socket.emit("post:get_post_by_sender", { sender: client1.id });
    });
    test("get post by id test", (done) => {
        client2.socket.once("post:get_post_by_id", (arg) => {
            expect(arg.message).toEqual(messageExample);
            expect(arg.sender).toEqual(client1.id);
            done();
        });
        client2.socket.emit("post:get_post_by_id", { id: postId });
    });
    test("update post test", (done) => {
        client1.socket.once("post:put_post_by_id", (arg) => {
            expect(arg.message).toEqual(messageExample2);
            expect(arg.sender).toEqual(client1.id);
            done();
        });
        client1.socket.emit("post:put_post_by_id", { id: postId, message: messageExample2 });
    });
    test("Test chat messages client1 to client2", (done) => {
        const message = 'hi client2 from client1';
        client2.socket.once('chat:message', (args) => {
            expect(args.to).toBe(client2.id);
            expect(args.message).toBe(message);
            expect(args.from).toBe(client1.id);
            done();
        });
        client1.socket.emit("chat:send_message", { to: client2.id, message: message });
    });
    test("Test chat messages client2 to client1", (done) => {
        const message = 'hi client1 from client2';
        client1.socket.once('chat:message', (args) => {
            expect(args.to).toBe(client1.id);
            expect(args.message).toBe(message);
            expect(args.from).toBe(client2.id);
            done();
        });
        client2.socket.emit("chat:send_message", { to: client1.id, message: message });
    });
    test("Test get messages", (done) => {
        client1.socket.once("chat:get_user_messages", (args) => {
            expect(args).not.toBe(null);
            done();
        });
        client1.socket.emit("chat:get_user_messages", { "id": client2.id });
    });
});
//# sourceMappingURL=socket.test.js.map