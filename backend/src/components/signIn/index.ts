import type{Request,Response} from 'express';
import {signInValidation} from '../../utils/zodValidation/userValidation.js'
import {PrismaClient} from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET= '123456';

export default async  function Login(req:Request,res:Response) {

    try {
      const verification = signInValidation.safeParse(req.body);

      if (!verification.success) {
        return res.status(400).json({
          message: "Invalid Input",
          error: verification.error,
        });
      }

      const { email, password } = verification.data;

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (!passwordMatch) {
        return res.status(400).json({
          message: "Incorrect password",
        });
      }

      const token = jwt.sign(
        {
          userId:existingUser.id,
          email:email
        },
        JWT_SECRET,
        {
          expiresIn:"1h"
        }
      )
      return res.status(201).json({
        message: "Login Successfully",
        token:token
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server error",
      });
    }
}