import { ReactNode } from "react";
// Re-export types from LogoMarquee for convenience
export type { LogoItem, LogoGalleryConfig } from "../components/LogoMarquee";
import type { LogoGalleryConfig } from "../components/LogoMarquee";

// Blog page configuration
// Controls whether posts appear on homepage, dedicated blog page, or both
export interface BlogPageConfig {
  enabled: boolean; // Enable the /blog route
  showInNav: boolean; // Show "Blog" link in navigation
  title: string; // Page title for the blog page
  description?: string; // Optional description shown on blog page
  order?: number; // Nav order (lower = first, matches page frontmatter order)
}

// Posts display configuration
// Controls where the post list appears
export interface PostsDisplayConfig {
  showOnHome: boolean; // Show post list on homepage
  showOnBlogPage: boolean; // Show post list on /blog page (requires blogPage.enabled)
}

// Site configuration interface
export interface SiteConfig {
  // Basic site info
  name: string;
  title: string;
  logo: string | null;
  intro: ReactNode;
  bio: string;

  // Featured section configuration
  featuredViewMode: "cards" | "list";
  showViewToggle: boolean;

  // Logo gallery configuration
  logoGallery: LogoGalleryConfig;

  // Blog page configuration
  blogPage: BlogPageConfig;

  // Posts display configuration
  postsDisplay: PostsDisplayConfig;

  // Links for footer section
  links: {
    docs: string;
    convex: string;
    netlify: string;
  };
}

// Default site configuration
// Customize this for your site
export const siteConfig: SiteConfig = {
  // Basic site info
  name: 'markdown "sync" site',
  title: "markdown sync site",
  // Optional logo/header image (place in public/images/, set to null to hide)
  logo: "/images/logo.svg",
  intro: null, // Set in Home.tsx to allow JSX with links
  bio: `Write locally, sync instantly with real-time updates. Powered by Convex and Netlify.`,

  // Featured section configuration
  // viewMode: 'list' shows bullet list, 'cards' shows card grid with excerpts
  featuredViewMode: "cards",
  // Allow users to toggle between list and card views
  showViewToggle: true,

  // Logo gallery configuration
  // Set enabled to false to hide, or remove/replace sample images with your own
  logoGallery: {
    enabled: true,
    images: [
      {
        src: "/images/logos/sample-logo-1.svg",
        href: "https://markdowncms.netlify.app/",
      },
      {
        src: "/images/logos/convex-wordmark-black.svg",
        href: "/about#the-real-time-twist",
      },
      {
        src: "/images/logos/sample-logo-3.svg",
        href: "https://markdowncms.netlify.app/",
      },
      {
        src: "/images/logos/sample-logo-4.svg",
        href: "https://markdowncms.netlify.app/",
      },
      {
        src: "/images/logos/sample-logo-5.svg",
        href: "https://markdowncms.netlify.app/",
      },
    ],
    position: "above-footer",
    speed: 30,
    title: "Trusted by (sample logos)",
  },

  // Blog page configuration
  // Set enabled to true to create a dedicated /blog page
  blogPage: {
    enabled: true, // Enable the /blog route
    showInNav: true, // Show "Blog" link in navigation
    title: "Blog", // Page title
    description: "All posts from the blog, sorted by date.", // Optional description
    order: 2, // Nav order (lower = first, e.g., 0 = first, 5 = after pages with order 0-4)
  },

  // Posts display configuration
  // Controls where the post list appears
  // Both can be true to show posts on homepage AND blog page
  // Set showOnHome to false to only show posts on /blog page
  postsDisplay: {
    showOnHome: true, // Show post list on homepage
    showOnBlogPage: true, // Show post list on /blog page
  },

  // Links for footer section
  links: {
    docs: "/setup-guide",
    convex: "https://convex.dev",
    netlify: "https://netlify.com",
  },
};

// Export the config as default for easy importing
export default siteConfig;
