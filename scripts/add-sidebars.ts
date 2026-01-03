import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const COMPARABLES_DIR = path.join(process.cwd(), "content/comparables");

function updateFrontmatter(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const { data, content: markdownContent } = matter(content);

  // Add the sidebar fields if they don't exist
  const updated = {
    ...data,
    layout: data.layout || "sidebar",
    rightSidebar: data.rightSidebar !== undefined ? data.rightSidebar : true,
    aiChat: data.aiChat !== undefined ? data.aiChat : true,
  };

  // Reconstruct the file
  const newContent = matter.stringify(markdownContent, updated);
  fs.writeFileSync(filePath, newContent, "utf-8");

  return path.basename(filePath);
}

function processDirectory(dir: string, label: string) {
  if (!fs.existsSync(dir)) {
    console.log(`${label} directory not found: ${dir}`);
    return 0;
  }

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
  console.log(`\nProcessing ${files.length} ${label} files...`);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const fileName = updateFrontmatter(filePath);
    console.log(`  ✓ Updated: ${fileName}`);
  });

  return files.length;
}

console.log("Adding sidebar frontmatter to all posts and comparables...");

const blogCount = processDirectory(BLOG_DIR, "blog");
const comparablesCount = processDirectory(COMPARABLES_DIR, "comparables");

console.log(`\n✅ Complete! Updated ${blogCount + comparablesCount} files total.`);
console.log("\nNext step: Run 'npm run sync' to sync changes to Convex.");
