import { Router } from "express";
import meetingRoutes from "./meeting.routes";

const router = Router();

router.use("/meeting", meetingRoutes );
router.use("/user", meetingRoutes );

export default router;