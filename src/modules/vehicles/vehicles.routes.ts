import express from "express";
import { vehiclesControllers } from "./vehicles.controllers";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constraint";

const router = express.Router();

router.post("/", logger, auth(Roles.admin), vehiclesControllers.createVehicles);

router.get("/", logger,  vehiclesControllers.getVehicles);

router.get("/:vehicleId", logger,  vehiclesControllers.getSingleVehicles)

router.put("/:vehicleId", logger, auth(Roles.admin), vehiclesControllers.updateVehicles)

router.delete("/:vehicleId", logger, auth(Roles.admin), vehiclesControllers.deleteVehicles)

export const vehiclesRoutes = router;