async function fetchBlogContent(title) {
  try {
    const response = await fetch(`http://localhost:8080/api/blogs`);
    const blogs = await response.json();
    const blog = blogs.find((blog) => blog.title === title);
    return blog;
  } catch (error) {
    console.error("Error fetching blog content:", error);
    return null;
  }
}

async function displayBlogContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get("title");

  if (title) {
    const blog = await fetchBlogContent(title);
    if (blog) {
      document.getElementById("blog-title").textContent = blog.title;
      document.getElementById("blog-body").innerHTML = blog.content;
    } else {
      document.getElementById("blog-content").textContent = "Blog not found.";
    }
  } else {
    document.getElementById("blog-content").textContent =
      "No blog title specified.";
  }
}

window.addEventListener("load", displayBlogContent);
