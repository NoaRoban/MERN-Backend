"use strict";
/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const users_1 = __importDefault(require("../controllers/users"));
const router = express_1.default.Router();
/**
* @swagger
* components:
*   schemas:
*     Message:
*       type: object
*       required:
*         - message
*         - userId
*       properties:
*         message:
*           type: string
*           description: The message content
*         userId:
*           type: string
*           description: The message owner user id
*       example:
*         message: 'Hello world'
*         userId: '12312ij12k1...'
*/
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: get user by id
 *     tags: [User]
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
router.get('/:id', auth_1.default.authenticateMiddleware, users_1.default.getUser);
/**
 * @swagger
 * /user/edit-user/{id}:
 *   post:
 *     summary: change user data
 *     tags: [User]
 *     security:
 *       - bearerAuth: [JWT]
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
router.post('/edit-user/:id', auth_1.default.authenticateMiddleware, users_1.default.editUserInfo);
exports.default = router;
//# sourceMappingURL=user_route.js.map