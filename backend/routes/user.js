import express from "express";
import { getUsers, getUser } from '../controllers/user.js';  // Updated to match controller function names
import { updateUser, deleteUser } from "../controllers/user.js";  // Keep the other routes as is

const router = express.Router();

router.get("/", getUsers);  // This uses getUsers from controller
router.get("/:id", getUser);  // This uses getUser from controller (note: getUser instead of getUserById)
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
