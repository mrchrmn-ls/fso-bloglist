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


  xdescribe("adding a new bloglist entry", () => {
    test("succeeds with valid fields", async () => {
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


    test("without likes defaults likes to zero", async () => {
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


  xdescribe("deleting a bloglist entry", () => {
    test("succeeds with status code 204", async () => {
      const blogToDelete = await helper.getFirstBlog();

      await api.delete(`/api/blogs/${blogToDelete.id}`)
               .expect(204);

      const remainingBlogs = await helper.getBlogsInDB();

      expect(remainingBlogs).toHaveLength(helper.initialBloglist.length - 1);
    });
  });


  describe("updating a blog", () => {
    test("succeeds with 200 and updated data", async () => {
      const blogToUpdate = await helper.getFirstBlog();

      const updateData = {
        likes: 99
      };

      const updated = await api.put(`/api/blogs/${blogToUpdate.id}`)
                               .send(updateData)
                               .expect(200)
                               .expect("Content-Type", /application\/json/);

      expect(updated.body.likes).toBe(99);
    });
  });
});


afterAll(() => {
  mongoose.connection.close();
});