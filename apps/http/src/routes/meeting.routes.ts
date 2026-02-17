import { Router } from "express";
import { createMeetingController, getMeeting, bookSlot } from "../controller/meeting.controller";

const router = Router();

router.post("/create", createMeetingController);
router.get("/:id", getMeeting);
router.post("/:id/book", bookSlot);

export default router;