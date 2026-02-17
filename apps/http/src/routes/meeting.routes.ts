import { Router


 } from "express";
import { createMeetingController } from "../controller/meeting.controller";

 const router = Router();

 router.get("/create", createMeetingController)

 export default router