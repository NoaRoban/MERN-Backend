/**
* @swagger
* tags:
*   name: User
*   description: The User API
*/

import express from 'express'
import auth from '../controllers/auth'
import users from '../controllers/users'

const router = express.Router()

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
router.get('/:id', auth.authenticateMiddleware, users.getUser)

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
router.post('/edit-user/:id', auth.authenticateMiddleware, users.editUserInfo)

export default router;