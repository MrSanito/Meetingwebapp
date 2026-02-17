import { Router


 } from "express";
import { createMeetingController, getMeeting } from "../controller/meeting.controller";

 const router = Router();

 router.get("/create", createMeetingController)
 router.get("/get", getMeeting)

 export default router