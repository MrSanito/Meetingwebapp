import type { Request, Response } from "express";
import prisma from "../client";

export const createUser = async (req: Request, res: Response): Promise<void> => { 
    try {
        const { name, username, email } = req.body;

        if(!name || !username || !email){
            res.status(400).json({
                success: false,
                message: "Name and username are required"
            });
            return;
        }

        const user = await prisma.user.create({
            data: {
                name,
                username,
                email: email || null
            }
        });

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}