"use strict";
/**
* @swagger
* tags:
*   name: Student
*   description: The Student API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const student_1 = __importDefault(require("../controllers/student"));
const router = express_1.default.Router();
/**
* @swagger
* components:
*   schemas:
*     Student:
*       type: object
*       required:
*         - id
*         - name
*         - avatarUrl
*       properties:
*         id:
*           type: string
*           description: The student id
*         name:
*           type: string
*           description: The student name
*         avatarUrl:
*           type: string
*           description: The student avatar url
*       example:
*         id: '123'
*         name: 'Oren'
*         avatarUrl: 'www.mysute/oren.jpg'
*/
/**
 * @swagger
 * /student:
 *   get:
 *     summary: get list of post from server
 *     tags: [Student]
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Student'
 *
 */
router.get('/', student_1.default.getAllStudents);
/**
 * @swagger
 * /student/{id}:
 *   get:
 *     summary: get student by id
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the requested post id
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 */
router.get('/:id', student_1.default.getStudentById);
/**
 * @swagger
 * /student:
 *   post:
 *     summary: add a new post
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: the requested student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *
 */
router.post('/', student_1.default.addNewStudent);
module.exports = router;
//# sourceMappingURL=student_route.js.map