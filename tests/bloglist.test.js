const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

let authorization;

beforeEach(async () => {
  await User.deleteMany();

  const passwordHash = await bcrypt.hash("testpw", 10);
  const user = new User({
    username: "tester",
    name: "Test User",
    passwordHash
  });
  await user.save();

  const login = {
    username: "tester",
    password: "testpw"
  };
  let response = await api.post("/api/login")
                          .send(login);
  authorization = `bearer ${response.body.token}`;

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
               .set("authorization", authorization)
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
                           .set("authorization", authorization)
                           .expect("Content-Type", /application\/json/);

      expect(saved.body["likes"]).toBeDefined();
      expect(saved.body.likes).toBe(0);
    });


    xtest("fails with 400 if url and title missing", async () => {
      const newBlog = {
        author: "Marc Hermann",
        likes: 7
      };

      await api.post("/api/blogs")
               .send(newBlog)
               .expect(400)
               .set("authorization", authorization);

      const blogsInDB = await helper.getBlogsInDB();
      expect(blogsInDB).toHaveLength(helper.initialBloglist.length);
    });

    test("testing without authorization fails with 401", async () => {
      const newBlog = {
        title: "My way into programming",
        author: "Marc Hermann",
        url: "http://hrmn.dev",
        likes: 7
      };

      await api.post("/api/blogs")
               .send(newBlog)
               .expect(401)
               .expect("Content-Type", /application\/json/);
    });
  });


  xdescribe("deleting a bloglist entry", () => {
    test("succeeds with status code 204", async () => {
      for (let blog of helper.initialBloglist) {
        await api.post("/api/blogs")
        .send(blog)
        .set("authorization", authorization);
      }

      const blogToDelete = await helper.getFirstBlog();

      await api.delete(`/api/blogs/${blogToDelete.id}`)
               .expect(204)
               .set("authorization", authorization);

      const remainingBlogs = await helper.getBlogsInDB();

      expect(remainingBlogs).toHaveLength(helper.initialBloglist.length - 1);
    });
  });


  xdescribe("updating a blog", () => {
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