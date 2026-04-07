const Project = require('../models/Project');
const User = require('../models/User');


exports.createProject = async (req, res) => {
  try {
    const { title, description, image, techStack, githubLink, liveLink } = req.body;
    const project = new Project({
      title,
      description,
      image,
      techStack,
      githubLink,
      liveLink,
      owner: req.userId
    });
    await project.save();
    const populatedProject = await Project.findById(project._id).populate('owner', 'username profilePic');
    res.status(201).json(populatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('owner', 'username profilePic').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.userId }).populate('owner', 'username profilePic');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'username profilePic');
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const { title, description, image, techStack, githubLink, liveLink } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    project.image = image || project.image;
    project.techStack = techStack || project.techStack;
    project.githubLink = githubLink || project.githubLink;
    project.liveLink = liveLink || project.liveLink;
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.likes.includes(req.userId)) {
      project.likes = project.likes.filter(id => id.toString() !== req.userId);
    } else {
      project.likes.push(req.userId);
    }
    await project.save();
    res.json({ likes: project.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// No extra exports needed since exports.xxx already works