import { getChannelMessages } from "controllers/channelMessages";
import express from "express";
import auth from "middlewares/auth";

const router = express.Router();

router.get("/getChannelMessages/:channelId", auth, getChannelMessages);

export default router;
