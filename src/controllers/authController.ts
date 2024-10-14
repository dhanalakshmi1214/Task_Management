import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { JwtPayload }  from "../interfaces/interfaces"
import { REFRESH_SECRET_KEY, SECRET_KEY} from "../config/dotConfig";


const prisma = new PrismaClient();

let refreshTokens :string[] = [];

export const userLogin = async( req:Request, res:Response) =>{
    const { email, password} = req.body;
    console.log(`Login is attempted by users email id is ${email}`)

    
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      console.log("Incorrect email ID");
      return  res.status(401).json({ message: "Incorrect Email Id" }); 
    }
    console.log("User Found :", user);  

    const isMatch = await argon2.verify( user.password, password)

   

    if(isMatch){
      const accessToken = jwt.sign(
        {id : user.user_id, email: user.email},
        SECRET_KEY,
        {expiresIn: "5m"}
      )
      const refreshMyToken = jwt.sign(
        {id:user.user_id, email: user.email},
        REFRESH_SECRET_KEY,
        {expiresIn: "7d"}
      )
      refreshTokens.push(refreshMyToken) 
      res.status(200).json({message : "Successful Login", accessToken, refreshMyToken})
    }else{
      res.status(401).json({error: "Incorrect password"})
    }
  
    } catch (error) {
       console.error("Error is on server side ", error) 
       res.status(500).json({Error : "`Error is on server side", error})
    }
}

export const refreshToken =  async (req: Request, res: Response) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }
  
    if (!refreshTokens.includes(token)) {
      return res.status(403).json({ error: "Invalid tokens" });
    }
  
    jwt.verify(token,REFRESH_SECRET_KEY,(err: Error | null, decoded: string | jwt.JwtPayload | undefined) => {
      
        if (err || !decoded) {
          return res.status(403).json({ error: "Invalid refresh tokens" });
        }
  
        const user = decoded as JwtPayload;
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          SECRET_KEY,
          { expiresIn: "7d" }
        );
  
        res.json({ accessToken });
      }
    );
  };
  