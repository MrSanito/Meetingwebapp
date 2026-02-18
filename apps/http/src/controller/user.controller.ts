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

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const username = req.params.username as string;

        if (!username) {
            res.status(400).json({ success: false, message: "Username is required" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                createdMeetings: { // Hosted meetings
                    orderBy: { date: 'desc' }
                },
                bookedSlots: { // Attending meetings
                    include: {
                        meeting: {
                            include: { createdBy: true }
                        }
                    },
                    orderBy: { meeting: { date: 'desc' } }
                }
            }
        });

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const userWithRelations = user as any;

        res.status(200).json({
            success: true,
            user: {
                name: userWithRelations.name,
                username: userWithRelations.username,
                email: userWithRelations.email,
                hostedMeetings: userWithRelations.createdMeetings,
                bookedSlots: userWithRelations.bookedSlots
            }
        });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getUserAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const username = req.params.username as string;
        const date = req.query.date as string;

        if (!username || !date) {
            res.status(400).json({ success: false, message: "Username and date are required" });
            return;
        }

        const queryDate = new Date(date);
        const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));

        const user = await prisma.user.findUnique({
            where: { username },
            include: {
                // 1. Slots they have booked (Attending)
                bookedSlots: {
                    where: {
                        meeting: {
                            date: {
                                gte: startOfDay,
                                lte: endOfDay
                            }
                        }
                    },
                    include: { meeting: true }
                },
                // 2. Slots in their own meetings that are booked by others (Hosting & Busy)
                createdMeetings: {
                    where: {
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    },
                    include: {
                        slots: {
                            where: {
                                NOT: { bookedById: null }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const userWithRelations = user as any;
        const busySlots: { startTime: Date, endTime: Date, reason: string }[] = [];

        // Add slots they are attending
        if (userWithRelations.bookedSlots) {
            userWithRelations.bookedSlots.forEach((slot: any) => {
                busySlots.push({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    reason: "Attending: " + slot.meeting.title
                });
            });
        }

        // Add slots they are hosting that are booked
        if (userWithRelations.createdMeetings) {
            userWithRelations.createdMeetings.forEach((meeting: any) => {
                meeting.slots.forEach((slot: any) => {
                    busySlots.push({
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        reason: "Hosting: " + meeting.title
                    });
                });
            });
        }

        res.status(200).json({ success: true, busySlots });

    } catch (error) {
        console.error("Get Availability Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

