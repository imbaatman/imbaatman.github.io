async function fetchBlogs() {
  try {
    const response = await fetch("http://localhost:8080/api/blogs");
    const blogs = await response.json();
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

function createBlogPostLink(post) {
  const a = document.createElement("a");
  a.href = `blog.html?title=${encodeURIComponent(post.title)}`;
  a.className = "blog-link";
  a.innerHTML = `<strong>${post.title}</strong>`;
  return a;
}

async function populateBlogPosts() {
  const techBlogsDiv = document.getElementById("tech-blogs");
  const movieBlogsDiv = document.getElementById("movie-blogs");

  const blogs = await fetchBlogs();

  blogs.forEach((post) => {
    const link = createBlogPostLink(post);
    if (post.category === "tech") {
      techBlogsDiv.appendChild(link);
    } else if (post.category === "movies") {
      movieBlogsDiv.appendChild(link);
    }
  });
}

function setupCategorySelector() {
  const selector = document.getElementById("blog-category-selector");
  const techBlogsDiv = document.getElementById("tech-blogs");
  const movieBlogsDiv = document.getElementById("movie-blogs");

  selector.addEventListener("change", (event) => {
    if (event.target.value === "tech") {
      techBlogsDiv.style.display = "block";
      movieBlogsDiv.style.display = "none";
    } else if (event.target.value === "movies") {
      techBlogsDiv.style.display = "none";
      movieBlogsDiv.style.display = "block";
    }
  });
}

window.addEventListener("load", () => {
  populateBlogPosts();
  setupCategorySelector();
});
