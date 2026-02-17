import { Router } from "express";
import meetingRoutes from "./meeting.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/meeting", meetingRoutes );
router.use("/user", userRoutes );

export default router;