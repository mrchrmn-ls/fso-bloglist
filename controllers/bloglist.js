const getUser = require("../utils/middleware").getUser;
const bloglistRouter = require("express").Router();
const Blog = require("../models/blog");


bloglistRouter.get("/", async (_, res) => {
  const blogs = await Blog.find({})
                          .populate("user", { name: 1, username: 1 });
  res.json(blogs);
});


bloglistRouter.post("/", getUser, async (req, res) => {
  const user = req.user;

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes || 0,
    user: user._id
  });

  const saved = await blog.save();

  user.blogs = user.blogs.concat(saved._id);
  await user.save();

  res.status(201).json(saved);
});


bloglistRouter.delete("/:id", getUser, async (req, res) => {
  const user = req.user;

  const blog = await Blog.findById(req.params.id);

  if (!blog.user || (blog.user.toString() === user._id.toString())) {
    await blog.remove();
    res.status(204).end();
  } else {
    res.status(401).json({
      error: "unauthorized user"
    });
  }
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