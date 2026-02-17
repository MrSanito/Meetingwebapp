import prisma from "../client";
import { Request, Response } from "express";

interface CreateMeetingBody {
    meetingName: string;
    meetingDetails: string;
    selectedDate: string;
    selectedSlots: string[];
    creatorName: string;
    creatorUsername: string; // Ensure frontend sends this
    meetingId: string;
}

const parseTimeSlot = (date: string, timeRange: string) => {
    const [startStr, endStr] = timeRange.split(" - ");
    
    if (!startStr || !endStr) {
        throw new Error("Invalid time range format");
    }

    const parseTime = (timeStr: string) => {
        const parts = timeStr.split(" ");
        if (parts.length < 2) throw new Error("Invalid time format");
        const time = parts[0];
        const period = parts[1];

        if (!time || !period) throw new Error("Invalid time parts");

        const timeParts = time.split(":");
        if (timeParts.length < 2) throw new Error("Invalid time format H:M");
        
        let hours = Number(timeParts[0]);
        const minutes = Number(timeParts[1]);

        if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid time numbers");

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        
        return new Date(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
    };

    return {
        startTime: parseTime(startStr),
        endTime: parseTime(endStr)
    };
};

export const createMeetingController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { meetingName, meetingDetails, selectedDate, selectedSlots, creatorName, creatorUsername, meetingId } = req.body as CreateMeetingBody;

        if (!meetingName || !selectedDate || !selectedSlots || selectedSlots.length === 0 || !creatorUsername) {
            res.status(400).json({ success: false, message: "Missing required fields" });
            return;
        }

        let user = await prisma.user.findUnique({ where: { username: creatorUsername } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    username: creatorUsername,
                    name: creatorName || creatorUsername // Fallback
                }
            });
        }

        const meeting = await prisma.meeting.create({
            data: {
                id: meetingId,
                title: meetingName,
                description: meetingDetails,
                date: new Date(selectedDate),
                bookingToken: meetingId, 
                createdById: user.id,
                slots: {
                    create: selectedSlots.map(slot => {
                        const { startTime, endTime } = parseTimeSlot(selectedDate, slot);
                        return { startTime, endTime };
                    })
                }
            }
        });

        res.status(201).json({ success: true, message: "Meeting created", meetingId: meeting.id });

    } catch (error) {
        console.error("Create Meeting Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        if (!id) {
            res.status(400).json({ success: false, message: "Missing meeting ID" });
            return;
        }

        const meeting = await prisma.meeting.findUnique({
            where: { id },
            include: {
                slots: {
                    orderBy: { startTime: 'asc' },
                    include: { bookedBy: true }
                },
                createdBy: true
            }
        });

        if (!meeting) {
            res.status(404).json({ success: false, message: "Meeting not found" });
            return;
        }

        res.status(200).json({ success: true, meeting });
    } catch (error) {
        console.error("Get Meeting Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

import { sendEmail } from "../mailer";

// ... previous imports

export const bookSlot = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slotId, bookerName, bookerUsername, bookerEmail } = req.body;

        if (!slotId || !bookerUsername || !bookerEmail) {
            res.status(400).json({ success: false, message: "Missing required fields (including email)" });
            return;
        }

        let user = await prisma.user.findUnique({ where: { username: bookerUsername } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    username: bookerUsername,
                    name: bookerName || bookerUsername,
                    email: bookerEmail
                }
            });
        } else if (!user.email && bookerEmail) {
             user = await prisma.user.update({
                where: { id: user.id },
                data: { email: bookerEmail }
            });
        }

        const slot = await prisma.timeSlot.findUnique({ 
            where: { id: slotId },
            include: { 
                meeting: {
                    include: { createdBy: true }
                }
            } 
        });

        if (!slot) {
             res.status(404).json({ success: false, message: "Slot not found" });
             return;
        }
        if (slot.bookedById) {
            res.status(409).json({ success: false, message: "Slot already booked" });
            return;
        }

        await prisma.timeSlot.update({
            where: { id: slotId },
            data: {
                bookedById: user.id,
                bookedAt: new Date()
            }
        });

        const meetingDate = slot.meeting.date.toISOString().split('T')[0];
        const timeRange = `${slot.startTime.toLocaleTimeString()} - ${slot.endTime.toLocaleTimeString()}`;
        
        await sendEmail(
            bookerEmail, 
            "Booking Confirmed: " + slot.meeting.title,
            `You have successfully booked a slot for "${slot.meeting.title}" on ${meetingDate} at ${timeRange}.`
        );

        if (slot.meeting.createdBy.email) {
            await sendEmail(
                slot.meeting.createdBy.email,
                "New Booking: " + slot.meeting.title,
                `${bookerName} (${bookerEmail}) has booked a slot on ${meetingDate} at ${timeRange}.`
            );
        }

        res.status(200).json({ success: true, message: "Slot booked successfully" });

    } catch (error) {
        console.error("Book Slot Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}