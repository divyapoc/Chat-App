const express = require("express");
const router = express.Router();
const {
  registerUser,
  userLogin,
  allUsers,
} = require("../controllers/userControllers");
const { verify } = require("../middleware/authmiddleware");
router.route("/").post(registerUser).get(verify, allUsers);
router.route("/login").post(userLogin);

//router.post('/login' ,authUser)

module.exports = router;
