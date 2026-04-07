const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { 
  createPost, 
  getAllPosts, 
  getUserPosts, 
  deletePost, 
  likePost, 
  commentPost
} = require("../controllers/postController");


router.post("/", auth, createPost);
router.get("/", getAllPosts);
router.get("/user/:userId", getUserPosts);
router.delete("/:id", auth, deletePost);
router.put("/like/:id", auth, likePost);
router.post("/comment/:id", auth, commentPost);

module.exports = router;