function dummy() {
  return 1;
}

function totalLikes(blogs) {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;

  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
}

module.exports = {
  dummy,
  totalLikes
};