const bloglistRouter = require("express").Router();
const Blog = require("../models/blog");


bloglistRouter.get("/", async (_, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});


bloglistRouter.post("/", async (req, res) => {
  if (!req.body.likes) req.body.likes = 0;

  const blog = new Blog(req.body);

  const saved = await blog.save();
  res.status(201).json(saved);
});


module.exports = bloglistRouter;