import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import BlogSidebar from "../components/BlogSidebar";
import BlogPost from "../components/BlogPost";

// Comparables page component
// Displays a sidebar with links to all comparables
// and a main content area with full markdown content from comparables-intro page
export default function Comparables() {
  // Fetch all published comparables from Convex
  const comparables = useQuery(api.comparables.getAllComparables);

  // Fetch the comparables landing page content
  const introPage = useQuery(api.pages.getPageBySlug, { slug: "comparables-intro" });

  // Transform comparables for sidebar (only need slug, title, date)
  const sidebarComparables =
    comparables?.map((comparable) => ({
      slug: comparable.slug,
      title: comparable.title,
      date: comparable.date,
    })) || [];

  return (
    <div className="post-page post-page-with-sidebar">
      <nav className="post-nav post-nav-with-sidebar" />

      <div className="post-content-with-sidebar">
        {/* Left sidebar - comparables navigation */}
        <aside className="post-sidebar-wrapper post-sidebar-left">
          <BlogSidebar posts={sidebarComparables} />
        </aside>

        {/* Main content - render markdown from comparables-intro page */}
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
                <h1 className="post-title">Comparables</h1>
              </header>
              {/* Show message when no comparables exist */}
              {comparables !== undefined && comparables.length === 0 && (
                <p className="no-posts">No comparables yet. Check back soon!</p>
              )}
            </>
          )}
        </article>
      </div>
    </div>
  );
}
