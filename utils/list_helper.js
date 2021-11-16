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

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
};