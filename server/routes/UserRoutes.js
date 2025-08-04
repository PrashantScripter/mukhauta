import express from "express";
import CreateUser from "../controller/UserController.js";

const router = express.Router();

router.post("/sync-user", CreateUser);

export default router;
