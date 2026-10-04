import type{Request,Response} from 'express';
import {signUpValidation} from '../../utils/zodValidation/userValidation.js'
import {PrismaClient} from '@prisma/client';
import bcrypt from "bcryptjs";
import jwt  from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET= process.env.JWT_SECRET || '123456';

export default async  function SignUp(req:Request,res:Response) {

  try {
    const verification = signUpValidation.safeParse(req.body);

    if (!verification.success) {
      return res.status(400).json({
        message: "Invalid Input",
        error: verification.error,
      });
    }

    const { fname, lname, email, password } = verification.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fname,
        lname: lname ?? null,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(201).json({
      message: "User Created succesfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
    });
  }

}