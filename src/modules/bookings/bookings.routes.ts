import express from "express";
import { bookingsControllers } from "./bookings.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constraint";

const router = express.Router();

router.post("/", logger, auth(Roles.admin , Roles.customer), bookingsControllers.createBookings)

router.get("/", bookingsControllers.getBookings)

router.get("/:bookingId", logger, auth(), bookingsControllers.getSingleBookings)

router.put("/:bookingId", logger, auth(), bookingsControllers.updateBookings)

export const bookingsRoutes = router;