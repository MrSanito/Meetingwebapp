import prisma from "../client";

import { Request, Response } from "express";

export const createMeetingController = (req: Request, res: Response) => {
    res.json({ message: "Meeting created" });
}

export const getMeeting = async (req: Request, res: Response) => { 
    console.log("get meeting");
    try {
        const user = await prisma.user.create({
            data: {
                name: "John Doe",
                username: "johndoe" + Math.floor(Math.random() * 1000000)
            }
        })
        res.status(200).json({
            success: true, 
            message: "User created successfully",
            user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to create user"
        })
    }
 }