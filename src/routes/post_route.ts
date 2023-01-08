/**
* @swagger
* tags:
*   name: Post
*   description: The Posts API
*/

import express from 'express'
const router = express.Router()
import post from '../controllers/post.js'
import auth from '../controllers/auth.js'
import ReqCtrl from '../common/RequestCtrl'
import { Request, Response } from "express";

/**
* @swagger
* components:
*   schemas:
*     Post:
*       type: object
*       required:
*         - message
*         - sender
*       properties:
*         message:
*           type: string
*           description: The post text
*         sender:
*           type: string
*           description: The sending user id
*       example:
*         message: 'this is my new post'
*         sender: '12342345234556'
*/

/**
 * @swagger
 * /post:
 *   get:
 *     summary: get list of post from server
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           type: string
 *           description: filter the posts according to the given sender id
 *     responses:
 *       200:
 *         description: the list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                  $ref: '#/components/schemas/Post'
 *  
 */
router.get('/',auth.authenticateMiddleware, async (req: Request, res: Response) => {
    try{
        const response = await post.getAllPosts(ReqCtrl.fromRestRequest(req))
        response.sendRestResponse(res)
    }catch(err){
        res.status(400).send({
            status: '400',
            message: err.message,
        })
    }
})

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: get post by id
 *     tags: [Post]
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
router.get('/:id',auth.authenticateMiddleware,async (req: Request, res: Response)=>{
    try{
        const response = await post.getPostById(ReqCtrl.fromRestRequest(req))
        response.sendRestResponse(res)
    }catch(err){
        res.status(400).send({
            status: '400',
            message: err.message,
        })
    }
})

/**
 * @swagger
 * /post:
 *   post:
 *     summary: add a new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.post('/',auth.authenticateMiddleware,async (req: Request, res: Response)=>{
    try{
        const response = await post.addNewPost(ReqCtrl.fromRestRequest(req))
        response.sendRestResponse(res)
    }catch(err){
        res.status(400).send({
            status: '400',
            message: err.message,
        })
    }
})


/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: update existing post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         requiered: true
 *         schema:
 *           type: string
 *           description: the updated post id    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: the requested post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *  
 */
router.put('/:id',auth.authenticateMiddleware,async (req: Request, res: Response)=>{
    try{
        const response = await post.putPostById(ReqCtrl.fromRestRequest(req))
        response.sendRestResponse(res)
    }catch(err){
        res.status(400).send({
            status: '400',
            message: err.message,
        })
    }
})

export = router