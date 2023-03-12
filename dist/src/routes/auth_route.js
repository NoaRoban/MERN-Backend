"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_js_1 = __importDefault(require("../controllers/auth.js"));
/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/
/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Register success retuns user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Registeration error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: The error description
 *
 */
router.post('/register', auth_js_1.default.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login success retuns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               access_token:
 *                 type: string
 *                 description: The Access Token
 *               refresh_token:
 *                 type: string
 *                 description: The Refresh Token
 *             example:
 *               access_token: '223412341...'
 *               refresh_token: '123456...'
 *
 */
router.post('/login', auth_js_1.default.login);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: refresh access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: refresh token success retuns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               access_token:
 *                 type: string
 *                 description: The Access Token
 *               refresh_token:
 *                 type: string
 *                 description: The Refresh Token
 *             example:
 *               access_token: '223412341...'
 *               refresh_token: '123456...'
 *
 */
router.get('/refresh', auth_js_1.default.refresh);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout user invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: logout sucess, refresh token is invalidated
 *
 */
router.get('/logout', auth_js_1.default.logout);
/**
 * @swagger
 * /auth/google-sign-user:
 *   post:
 *     summary: Use Google access to sign in or create a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *         - email
 *         - name
 *         - avatarUrl
 *         - accessToken
 *       content:
 *         application/json:
 *           schema:
 *             email: string;
 *             name: string;
 *             avatar: string;
 *             accessToken: string;
 *     security:
 *       - bearerAuth: []
*     responses:
 *       200:
 *         description: Google sign user success retuns user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               access_token: '223412341...'
 *               id: '123oi12jnoisjad9io2...'
 *               refresh_token: '123456...'
 *
 *       400:
 *         description: Google sign user  error
 *         content:
 *           application/json:
 *             schema:
 *               err:
 *                 type: string
 *                 description: The error description
 *
 */
/**
 * @swagger
 * /auth/google-sign-user:
 *   post:
 *     summary: Use google access token to sign in or create a user
 *     tags: [Auth]
 *     parameters:
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the new/existing user
 *     requestBody:
 *       required: true
 *         - email
 *         - name
 *         - avatarUrl
 *         - accessToken
 *       content:
 *         application/json:
 *             schema:
 *               email:
 *                 type: string
 *                 description: user email
 *               name:
 *                 type: string
 *                 description: user display name
 *               avatarUrl:
 *                 type: string
 *                 description: user avatar url - google
 *               accessToken:
 *                 type: string
 *                 description: google generated access token
 *             example:
 *               email: 'David@gmail.com'
 *               name: 'David'
 *               avatarUrl: 'my.image.path/uploads...'
 *               accessToken: 'kdmudj1i2...'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               access_token:
 *                 type: string
 *                 description: The Access Token
 *               refresh_token:
 *                 type: string
 *                 description: The Refresh Token
 *             example:
 *               access_token: '223412341...'
 *               id: '12948uuedn9wu...'
 *               refresh_token: '123456...'
 *
 */
router.post('/google-sign-user', auth_js_1.default.googleSignUser);
module.exports = router;
//# sourceMappingURL=auth_route.js.map