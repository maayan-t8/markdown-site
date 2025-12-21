import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostList from "../components/PostList";
import siteConfig from "../config/siteConfig";
import { ArrowLeft } from "lucide-react";

// Blog page component
// Displays all published posts in a year-grouped list
// Controlled by siteConfig.blogPage and siteConfig.postsDisplay settings
export default function Blog() {
  const navigate = useNavigate();

  // Fetch published posts from Convex
  const posts = useQuery(api.posts.getAllPosts);

  // Check if posts should be shown on blog page
  const showPosts = siteConfig.postsDisplay.showOnBlogPage;

  return (
    <div className="blog-page">
      {/* Navigation with back button */}
      <nav className="post-nav">
        <button onClick={() => navigate("/")} className="back-button">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </nav>

      {/* Blog page header */}
      <header className="blog-header">
        <h1 className="blog-title">{siteConfig.blogPage.title}</h1>
        {siteConfig.blogPage.description && (
          <p className="blog-description">{siteConfig.blogPage.description}</p>
        )}
      </header>

      {/* Blog posts section */}
      {showPosts && (
        <section className="blog-posts">
          {posts === undefined ? null : posts.length === 0 ? (
            <p className="no-posts">No posts yet. Check back soon!</p>
          ) : (
            <PostList posts={posts} />
          )}
        </section>
      )}

      {/* Message when posts are disabled on blog page */}
      {!showPosts && (
        <p className="blog-disabled-message">
          Posts are configured to not display on this page. Update{" "}
          <code>postsDisplay.showOnBlogPage</code> in siteConfig to enable.
        </p>
      )}
    </div>
  );
}
