//here we writes all the logic of our post
import User from '../models/user_model'
import { NextFunction, Request,Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function sendError(res:Response,error:string){
    res.status(400).send({
        'err':error
    })
}

const register = async(req:Request,res:Response) => {
    const name= req.body.name
    const email = req.body.email
    const password = req.body.password

    if(email == null || password == null || name == null){
        return sendError(res, 'please provide valid email, password and name')
    }
    try{
        const user = await User.findOne({'email': email})
        if(user != null){
            sendError(res, 'user already registered, try different name')
        }
    }catch(err){
        console.log("error: " + err)
        sendError(res, 'fail checking user')
    }

    try{
        const salt = await bcrypt.genSalt(10)
        const encryptedPwd = await bcrypt.hash(password, salt)
        let newUser = new User({
            'name': name,
            'email': email,
            'password': encryptedPwd
        })
        newUser = await newUser.save()
        res.status(200).send({
            'name': name,
            'email': email,
            '_id': newUser._id
        })
    }catch(err){
        sendError(res, 'fail...')
    }
}

async function generateTokens(userId: string){
    const accessToken = await jwt.sign(
        {'id': userId},
        process.env.ACCESS_TOKEN_SECRET,
        {'expiresIn': process.env.JWT_TOKEN_EXPIRATION}
    )

    const refreshToken = await jwt.sign(
        {'id': userId},
        process.env.REFRESH_TOKEN_SECRET
    )
    return {'accessToken': accessToken, 'refreshToken':refreshToken}
}


const login = async(req:Request,res:Response) => {
    const email = req.body.email
    const password = req.body.password

    if(email == null || password == null) {
        return sendError(res,'please provide valid email or password')
    }
    try{
        const user = await User.findOne({'email': email})
        if(user == null) return sendError(res, 'incorrect user or password')
        
        const match = await bcrypt.compare(password, user.password)
        if(!match) return sendError(res, 'incorrect user or password')

        const tokens = await generateTokens(user._id.toString())

        console.log("the user we generete for him tokens  -  "+user.id.toString())
        console.log("access token  -  "+ tokens.accessToken)
        console.log("refresh token  -  "+ tokens.refreshToken)

        console.log("the user we generete for him tokens  -  "+user.id.toString())

        //in case the user does not have reefresh token because the tooken given in the login and not in the registration 
        if(user.refresh_tokens == null) user.refresh_tokens=[tokens.refreshToken]
        else user.refresh_tokens.push(tokens.refreshToken)
        await user.save()

        return res.status(200).send({ ...tokens, id: user._id })
    }catch(err){
        console.log("error: " + err)
        return sendError(res, 'fail checking user')
    }
}

function getTokenFromRequest(req:Request): string{
    const authHeader = req.headers['authorization']
    if(authHeader == null) return null
    return authHeader.split(' ')[1]  
}
type TokenInfo = {
    id: string
}
const refresh = async(req:Request,res:Response) => {
   const refreshToken = getTokenFromRequest(req)
   if(refreshToken == null) return sendError(res, 'authentication missing')    
    
   try{
        const user: TokenInfo = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user.id)
        if(userObj == null) return sendError(res, ' failed validating token')
        
        if(!userObj.refresh_tokens.includes(refreshToken)){
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(res, ' failed validating token')
        }
        const tokens = await generateTokens(userObj._id.toString())
        
        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = tokens.refreshToken
        console.log("refresh token: " + refreshToken)
        console.log("with token: " + tokens.refreshToken)
        await userObj.save()

        return res.status(200).send({ ...tokens, id: userObj._id })
    }catch(err){
        return sendError(res, ' failed validating token ---- refresh token')
    }
}

const logout = async (req:Request ,res:Response)=>{
    const refreshToken = getTokenFromRequest(req)
    if (refreshToken == null) return sendError(res,'authentication missing')

    try{
        const user: TokenInfo = <TokenInfo>jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userObj = await User.findById(user.id)
        if (userObj == null) return sendError(res,'fail validating token')

        if (!userObj.refresh_tokens.includes(refreshToken)){
            userObj.refresh_tokens = []
            await userObj.save()
            return sendError(res,'fail validating token ---- logout')
        }

        userObj.refresh_tokens.splice(userObj.refresh_tokens.indexOf(refreshToken),1)
        await userObj.save()
        res.status(200).send()
    }catch(err){
        return sendError(res,'fail validating token ---- logout')
    }
}


const authenticateMiddleware = async(req:Request,res:Response, next: NextFunction) => {
    const token = getTokenFromRequest(req)
    if(token == null) return sendError(res, 'authentication missing')    
    try{
        const user: TokenInfo = <TokenInfo>jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        req.body.userId = user.id

        next()
    }catch(err){
        return sendError(res, ' failed validating token ---- authenticateMiddleware')
    }
}


export = {register, login, refresh, logout, authenticateMiddleware}