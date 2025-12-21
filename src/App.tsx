import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Stats from "./pages/Stats";
import Blog from "./pages/Blog";
import Layout from "./components/Layout";
import { usePageTracking } from "./hooks/usePageTracking";
import siteConfig from "./config/siteConfig";

function App() {
  // Track page views and active sessions
  usePageTracking();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        {/* Blog page route - only enabled when blogPage.enabled is true */}
        {siteConfig.blogPage.enabled && (
          <Route path="/blog" element={<Blog />} />
        )}
        {/* Catch-all for post/page slugs - must be last */}
        <Route path="/:slug" element={<Post />} />
      </Routes>
    </Layout>
  );
}

export default App;
