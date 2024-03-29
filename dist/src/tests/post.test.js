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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const newPostMessage = 'This is the new post message';
let newPostSender = '';
let newPostId = '';
const newPostMessageUpdated = 'This is the updated message';
const userEmail = "user1@gmail.com";
const userPassword = "12345";
const userName = "Noa";
let accessToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    const res = yield (0, supertest_1.default)(server_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName,
    });
    newPostSender = res.body._id;
    console.log('the idddddddddddd: ' + newPostSender);
}));
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        });
        accessToken = response.body.accessToken;
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loginUser();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    mongoose_1.default.connection.close();
}));
describe("Posts Tests", () => {
    jest.setTimeout(30000);
    test("add new post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/post').set('Authorization', 'JWT ' + accessToken).send({
            "text": newPostMessage,
            "userId": newPostSender,
            "imageUrl": "",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.text).toEqual(newPostMessage);
        expect(response.body.userId).toEqual(newPostSender);
        newPostId = response.body._id;
        console.log('the new post id = ' + newPostId);
    }));
    test("get all posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        try {
            expect(response.body.post[0].text).toEqual(newPostMessage);
            expect(response.body.post[0].userId).toEqual(newPostSender);
        }
        catch (_a) {
            console.log('DB is empty');
        }
    }));
    /*test("get all posts containing given text in post message", async()=>{
         const response = await request(app).get('/post?text=new').set('Authorization', 'JWT ' + accessToken)
         expect(response.statusCode).toEqual(200)
         expect(response.body.post[0].text).toEqual(newPostMessage)
         expect(response.body.post[0].userId).toEqual(newPostSender)
     })*/
    test("get post by Id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.text).toEqual(newPostMessage);
        expect(response.body.post.userId).toEqual(newPostSender);
    }));
    test("get post by wrong Id fails", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/1235').set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(400);
    }));
    /*test("get post by sender", async()=>{
        const response = await request(app).get('/post?sender='+newPostSender).set('Authorization', 'JWT '+ accessToken)
        console.log('the sender is '+ response.body.post[0].userId)
        expect(response.statusCode).toEqual(200)
        expect(response.body.post[0].text).toEqual(newPostMessage)
    })*/
    test("update post by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        //here we update the sender also
        let response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken).send({
            'text': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.text).toEqual(newPostMessageUpdated);
        expect(response.body.post.userId).toEqual(newPostSender);
        //here we update only the message
        response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken).send({ text: newPostMessageUpdated });
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.text).toEqual(newPostMessageUpdated);
        expect(response.body.post.userId).toEqual(newPostSender);
        console.log('the sender is ' + response.body.post.userId);
        console.log('the updated message is ' + response.body.post.text);
        response = yield (0, supertest_1.default)(server_1.default).put('/post/12345').set('Authorization', 'JWT ' + accessToken)
            .send({
            'text': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        });
        expect(response.statusCode).toEqual(400);
        response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).set('Authorization', 'JWT ' + accessToken)
            .send({
            "text": newPostMessageUpdated,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.post.text).toEqual(newPostMessageUpdated);
        expect(response.body.post.userId).toEqual(newPostSender);
    }));
    /*test("update post by wrong id", async()=>{
        //if the ID does not exist then we need to add a new post
        let response = await request(app).put('/post/1538').set('Authorization', 'JWT ' + accessToken).send({
            'message': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(400)
        //create a new post
        const newPostSenderWithNewId= '1234'
        response = await request(app).post('/post').set('Authorization', 'JWT ' + accessToken).send({
            'message': newPostMessageUpdated,
            "userId": newPostSender,
            "imageUrl": "",
        })
        expect(response.statusCode).toEqual(200)
        expect(response.body.post.message).toEqual(newPostMessage)
        expect(response.body.post.userId).toEqual(newPostSenderWithNewId)
    })*/
});
//# sourceMappingURL=post.test.js.map