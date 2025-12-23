import { useEffect, useState } from "react";
import { Heading } from "../utils/extractHeadings";

interface PageSidebarProps {
  headings: Heading[];
  activeId?: string;
}

export default function PageSidebar({ headings, activeId }: PageSidebarProps) {
  const [activeHeading, setActiveHeading] = useState<string | undefined>(activeId);

  // Update active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for header

      // Find the heading that's currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="page-sidebar">
      <ul className="page-sidebar-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`page-sidebar-item page-sidebar-item-level-${heading.level} ${
              activeHeading === heading.id ? "active" : ""
            }`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(heading.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                  // Update URL without scrolling
                  window.history.pushState(null, "", `#${heading.id}`);
                }
              }}
              className="page-sidebar-link"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

