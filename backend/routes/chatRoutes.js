const express = require("express");
const asyncHandler = require("express-async-handler");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addtoGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

const { verify } = require("../middleware/authmiddleware");
// router.route("/").get(verify, accessChat).post(verify, fetchChats);
router.route("/").post(verify, accessChat);
router.route("/").get(verify, fetchChats);
router.route("/group").post(verify, createGroupChat);
router.route("/rename-group").put(verify, renameGroup);
router.route("/group-add-member").put(verify, addtoGroup);
router.route("/group-remove-member").put(verify, removeFromGroup);

module.exports = router;
