import CopyPageDropdown from "./CopyPageDropdown";

interface RightSidebarProps {
  title: string;
  content: string;
  url: string;
  slug: string;
  description?: string;
  date?: string;
  tags?: string[];
  readTime?: string;
}

export default function RightSidebar(props: RightSidebarProps) {
  return (
    <aside className="post-sidebar-right">
      <div className="right-sidebar-content">
        <CopyPageDropdown {...props} />
      </div>
    </aside>
  );
}

