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
const student_model_1 = __importDefault(require("../models/student_model"));
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getAllStudents');
    try {
        let students = {};
        students = yield student_model_1.default.find();
        res.status(200).send(students);
    }
    catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db" });
    }
});
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const students = yield student_model_1.default.findById(req.params.id);
        res.status(200).send(students);
    }
    catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db" });
    }
});
const addNewStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const student = new student_model_1.default({
        _id: req.body._id,
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
    });
    try {
        const newStudent = yield student.save();
        console.log("save student in db");
        res.status(200).send(newStudent);
    }
    catch (err) {
        console.log("fail to save student in db " + err);
        res.status(400).send({ 'error': 'fail adding new post to db' });
    }
});
module.exports = { getAllStudents, getStudentById, addNewStudent };
//# sourceMappingURL=student.js.map