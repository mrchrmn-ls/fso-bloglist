const jwt = require("jsonwebtoken");
const bloglistRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

function getTokenFrom(req) {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
}


bloglistRouter.get("/", async (_, res) => {
  const blogs = await Blog.find({})
                          .populate("user", { name: 1, username: 1 });
  res.json(blogs);
});


bloglistRouter.post("/", async (req, res) => {
  const token = getTokenFrom(req);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    res.status(401).json({
      error: "token missing or invalid"
    });

    return null;
  }

  const user = await User.findById(decodedToken.id);

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