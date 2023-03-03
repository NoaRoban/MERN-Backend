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
const student_model_1 = __importDefault(require("../models/student_model"));
let newStudenId = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield student_model_1.default.remove(); //{ 'id: ': newStudenId })
    console.log('beforeAll');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    //console.log('afterAll')
    mongoose_1.default.connection.close();
}));
describe("Student Tests", () => {
    test("add new student", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/student')
            .send({
            "_id": 1234,
            "name": "Oren",
            "avatarUrl": "www.localhost:3000/oren.jpg"
        });
        expect(response.statusCode).toEqual(200);
        newStudenId = response.body._id;
    }));
    test("get all students", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/student');
        expect(response.statusCode).toEqual(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    }));
    test("get student by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/student/' + newStudenId);
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=student.test.js.map