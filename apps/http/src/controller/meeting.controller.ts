import prisma from "../client";
import { Request, Response } from "express";

export const createMeetingController = () => {
    
}

export const getMeeting = (req: Request, res: Response) => { 
    console.log("get meeting");
    res.status(200).json({success: true, 
        message: "ohh hit ho gaya "
    })
    
 }