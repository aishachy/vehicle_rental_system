import express from "express";
import { usersControllers } from "./users.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
import { Roles } from "../auth/auth.constraint";

const router = express.Router();

router.post("/", logger, usersControllers.createUser);

router.get("/", logger, auth(Roles.admin), usersControllers.getUsers)

router.get("/:userId", logger, usersControllers.getSingleUsers)

router.put("/:userId", logger, auth(Roles.admin, Roles.customer), usersControllers.updateUsers)

router.delete("/:userId", logger, auth(Roles.admin), usersControllers.deleteUsers)

export const usersRoutes = router;

