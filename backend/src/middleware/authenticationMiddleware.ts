import type { NextFunction,Response,Request } from "express";
import jwt from 'jsonwebtoken'

const JWT_SECRET = '123456';

export default async function(req:Request,res:Response,next:NextFunction) {
    try{
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message:"not authorized"
        })
    }

    const token = authHeader.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            message:"unauthorized"
        })
    }

    const decoded = await jwt.verify(token,JWT_SECRET);
    console.log(decoded);
    next();
    } catch(error) {
        return res.status(401).json({
            message:"Invalid token or expired token"
        })
    }
}