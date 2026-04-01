const express = require("express");
const router = express.Router();
const { getConversations, getMessages, sendMessage, auth } = require("../controllers/messageController");

router.get("/conversations", auth, getConversations);
router.get("/:userId", auth, getMessages);
router.post("/", auth, sendMessage);

module.exports = router;