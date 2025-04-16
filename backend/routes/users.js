import express from "express";
import {
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
