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


bloglistRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});


bloglistRouter.put("/:id", async (req, res) => {
  const blog = {
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  };

  const updated = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
  res.status(200).json(updated);
});


module.exports = bloglistRouter;