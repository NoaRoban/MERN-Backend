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
require('dotenv').config();
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const userEmail = "noa@gmail.com";
const userPassword = "12345";
const userName = "Noa";
const userNewName = "Guy";
let userId = '';
let accessToken = '';
let reefreshToken = '';
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    yield user_model_1.default.remove();
    const res = yield (0, supertest_1.default)(server_1.default).post('/auth/register').send({
        "email": userEmail,
        "password": userPassword,
        "name": userName
    });
    userId = res.body._id;
}));
function loginUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword
        });
        accessToken = response.body.accessToken;
        reefreshToken = response.body.reefreshToken;
        console.log('acc tkn' + accessToken);
        console.log('ref tkn' + reefreshToken);
    });
}
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield loginUser();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.findByIdAndDelete(userId);
    mongoose_1.default.connection.close();
}));
describe("User Tests", () => {
    test("Get My information by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get(`/user/${userId}`).set('Authorization', 'JWT ' + accessToken);
        expect(response.statusCode).toEqual(200);
        expect(response.body.email).toEqual(userEmail);
        expect(response.body._id).toEqual(userId);
    }));
    test("Edit my information by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).post(`/user/edit-user/${userId}`).set('Authorization', 'JWT ' + accessToken)
            .send({
            "name": userNewName
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.msg).toEqual('Update succes');
    }));
});
//# sourceMappingURL=user.test.js.map