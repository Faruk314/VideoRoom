import { getChannel } from "controllers/channel";
import express from "express";
import auth from "middlewares/auth";

const router = express.Router();

router.get("/getChannel/:channelId", auth, getChannel);

export default router;
