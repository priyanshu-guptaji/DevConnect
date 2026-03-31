const express = require("express");
const router = express.Router();
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

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", login);
router.get("/all", getAllUsers);
router.get("/:id", getUser);
router.put("/update", auth, updateUser);
router.put("/follow/:id", auth, followUser);
router.get("/following", auth, getFollowing);
router.get("/followers", auth, getFollowers);

module.exports = router;