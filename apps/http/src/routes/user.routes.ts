import { Router} from "express";
 import { createUser, getUserProfile, getUserAvailability } from "../controller/user.controller";

 const router = Router();

 router.post("/create", createUser)
 router.get("/availability/:username", getUserAvailability);
 router.get("/:username", getUserProfile);
 
 export default router