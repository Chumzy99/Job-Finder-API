import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();
import authController from "../controllers/authController";

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
