const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { 
  createProject, 
  getAllProjects, 
  getUserProjects,
  getProject, 
  updateProject, 
  deleteProject, 
  likeProject
} = require("../controllers/projectController");


router.post("/", auth, createProject);
router.get("/", getAllProjects);
router.get("/user/:userId", getUserProjects);
router.get("/:id", getProject);
router.put("/:id", auth, updateProject);
router.delete("/:id", auth, deleteProject);
router.put("/like/:id", auth, likeProject);

module.exports = router;