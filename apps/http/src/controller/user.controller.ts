import type { Request, Response } from "express";
import prisma from "../client";

export const createUser = async (req: Request, res: Response) => { 
    const {name, username} = req.body;

    if(!name || !username){
        return res.status(400).json({
            success: false,
            message: "Name and username are required"
        })
    }

    const user = await prisma.user.create({
        data: {
            name,
            username
        }
    })
    
 }