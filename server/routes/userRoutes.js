const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { 
  register, 
  login, 
  getAllUsers, 
  getUser, 
  updateUser, 
  followUser,
  getFollowing,
  getFollowers 
} = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.put("/update", auth, updateUser);
router.put("/follow/:id", auth, followUser);
router.get("/following", auth, getFollowing);
router.get("/followers", auth, getFollowers);

module.exports = router;