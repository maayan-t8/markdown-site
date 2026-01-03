import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import BlogSidebar from "../components/BlogSidebar";
import BlogPost from "../components/BlogPost";

// Blog page component
// Displays a sidebar with links to all blog posts
// and a main content area with full markdown content from blog-intro page
export default function Blog() {
  // Fetch all published posts from Convex
  const posts = useQuery(api.posts.getAllPosts);

  // Fetch the blog landing page content
  const introPage = useQuery(api.pages.getPageBySlug, { slug: "blog-intro" });

  // Transform posts for sidebar (only need slug, title, date)
  const sidebarPosts =
    posts?.map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
    })) || [];

  return (
    <div className="post-page post-page-with-sidebar">
      <nav className="post-nav post-nav-with-sidebar" />

      <div className="post-content-with-sidebar">
        {/* Left sidebar - blog post navigation */}
        <aside className="post-sidebar-wrapper post-sidebar-left">
          <BlogSidebar posts={sidebarPosts} />
        </aside>

        {/* Main content - render markdown from blog-intro page */}
        <article className="post-article post-article-with-sidebar">
          {introPage ? (
            <>
              <header className="post-header">
                <h1 className="post-title">{introPage.title}</h1>
              </header>
              <BlogPost content={introPage.content} />
            </>
          ) : (
            <>
              <header className="post-header">
                <h1 className="post-title">Blog</h1>
              </header>
              {/* Show message when no posts exist */}
              {posts !== undefined && posts.length === 0 && (
                <p className="no-posts">No posts yet. Check back soon!</p>
              )}
            </>
          )}
        </article>
      </div>
    </div>
  );
}
