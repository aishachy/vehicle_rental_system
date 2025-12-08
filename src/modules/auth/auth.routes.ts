import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signin", authController.signInUser)

router.post("/signup", authController.signUpUser)

export const authRoutes = router;