const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany();
  await Blog.insertMany(helper.initialBloglist);
});


describe("when there are blogs in the bloglist", () => {
  xtest("blogs are returned as json", async () => {
    await api.get("/api/blogs")
             .expect(200)
             .expect("Content-Type", /application\/json/);
  });


  xtest("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body).toHaveLength(helper.initialBloglist.length);
  });


  xtest("a specific blog is among the returned notes", async () => {
    const response = await api.get("/api/blogs");

    const titles = response.body.map(blog => blog.title);
    expect(titles).toContain("Go To Statement Considered Harmful");
  });


  xtest("unique identifier is 'id'", async () => {
    const blog = await helper.getFirstBlog();

    expect(blog["id"]).toBeDefined();
  });


  describe("adding a new bloglist entry", () => {
    xtest("succeeds with valid fields", async () => {
      const newBlog = {
        title: "My way into programming",
        author: "Marc Hermann",
        url: "http://hrmn.dev",
        likes: 7
      };

      await api.post("/api/blogs")
               .send(newBlog)
               .expect(201)
               .expect("Content-Type", /application\/json/);

      const blogsInDB = await helper.getBlogsInDB();
      expect(blogsInDB).toHaveLength(helper.initialBloglist.length + 1);

      const titles = blogsInDB.map(blog => blog.title);
      expect(titles).toContain("My way into programming");
    });


    xtest("without likes defaults likes to zero", async () => {
      const newBlog = {
        title: "My way into programming",
        author: "Marc Hermann",
        url: "http://hrmn.dev",
      };

      let saved = await api.post("/api/blogs")
                           .send(newBlog)
                           .expect(201)
                           .expect("Content-Type", /application\/json/);

      expect(saved.body["likes"]).toBeDefined();
      expect(saved.body.likes).toBe(0);
    });


    test("fails with 400 if url and title missing", async () => {
      const newBlog = {
        author: "Marc Hermann",
        likes: 7
      };

      await api.post("/api/blogs")
               .send(newBlog)
               .expect(400);

      const blogsInDB = await helper.getBlogsInDB();
      expect(blogsInDB).toHaveLength(helper.initialBloglist.length);
    });

  });
});


afterAll(() => {
  mongoose.connection.close();
});