function dummy() {
  return 1;
}

function totalLikes(blogs) {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;

  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
}

function favouriteBlog(blogs) {
  if (blogs.length === 0) return {};

  let maxLikes = 0;
  let favourite = blogs[0];

  blogs.forEach(blog => {
    if (blog.likes > maxLikes) {
      favourite = blog;
      maxLikes = blog.likes;
    }
  });

  return {
    title: favourite.title,
    author: favourite.author,
    likes: favourite.likes
  };
}

function mostBlogs(blogs) {
  if (blogs.length === 0) return {};
  if (blogs.length === 1) return {
    author: blogs[0].author,
    blogs: 1
  };

  let authorsCount = {};

  blogs.forEach(blog => {
    authorsCount[blog.author] = authorsCount[blog.author] || 0;
    authorsCount[blog.author] += 1;
  });

  let authors = Object.keys(authorsCount);
  let counts = authors.map(author => authorsCount[author]);
  let maxCount = Math.max(...counts);
  let maxAuthor = authors[counts.indexOf(maxCount)];

  return {
    author: maxAuthor,
    blogs: maxCount
  };
}

function mostLikes(blogs) {
  if (blogs.length === 0) return {};
  if (blogs.length === 1) return {
    author: blogs[0].author,
    likes: blogs[0].likes
  };

  let authorsLikes = {};

  blogs.forEach(blog => {
    authorsLikes[blog.author] = authorsLikes[blog.author] || 0;
    authorsLikes[blog.author] += blog.likes;
  });

  let authors = Object.keys(authorsLikes);
  let likes = authors.map(author => authorsLikes[author]);
  let maxLikes = Math.max(...likes);
  let maxAuthor = authors[likes.indexOf(maxLikes)];

  return {
    author: maxAuthor,
    likes: maxLikes
  };

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
};