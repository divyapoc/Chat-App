const express = require("express");
const router = express.Router();
const { verify } = require("../middleware/authmiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageController");
router.route("/").post(verify, sendMessage);
//get chat messages
router.route("/:chatId").get(verify, allMessages);
module.exports = router;
