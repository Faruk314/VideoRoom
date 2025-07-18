import { getLoginStatus, login, logout, register } from "controllers/auth";
import express from "express";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/getLoginStatus", getLoginStatus);

export default router;
