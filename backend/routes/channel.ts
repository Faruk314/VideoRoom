import { createChannel, getChannel } from "controllers/channel";
import express from "express";
import auth from "middlewares/auth";

const router = express.Router();

router.post("/createChannel", auth, createChannel);

router.get("/getChannel/:channelId", auth, getChannel);

export default router;
