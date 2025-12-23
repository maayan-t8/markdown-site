---
title: "Netlify edge functions blocking AI crawlers from static files"
description: "Why excludedPath in netlify.toml isn't preventing edge functions from intercepting /raw/* requests, and how ChatGPT and Perplexity get blocked while Claude works."
date: "2025-12-21"
slug: "netlify-edge-excludedpath-ai-crawlers"
published: true
tags: ["netlify", "edge-functions", "ai", "troubleshooting", "help"]
readTime: "4 min read"
featured: false
---

## The problem

AI crawlers cannot access static markdown files at `/raw/*.md` on Netlify, even with `excludedPath` configured. ChatGPT and Perplexity return errors. Claude works.

## What we're building

A markdown blog framework that generates static `.md` files in `public/raw/` during build. Users can share posts with AI tools via a Copy Page dropdown that sends raw markdown URLs.

The goal: AI services fetch `/raw/{slug}.md` and parse clean markdown without HTML.

## The errors

**ChatGPT:**

```
I attempted to load and read the raw markdown at the URL you provided but was unable to fetch the content from that link. The page could not be loaded directly and I cannot access its raw markdown.
```

**Perplexity:**

```
The page could not be loaded with the tools currently available, so its raw markdown content is not accessible.
```

**Claude:**
Works. Loads and reads the markdown successfully.

## Current configuration

Static files exist in `public/raw/` and are served via `_redirects`:

```
/raw/*         /raw/:splat    200
```

Edge function configuration in `netlify.toml`:

```toml
[[edge_functions]]
  path = "/*"
  function = "botMeta"
  excludedPath = "/raw/*"
```

The `botMeta` function also has a code-level check:

```typescript
// Skip if it's the home page, static assets, API routes, or raw markdown files
if (
  pathParts.length === 0 ||
  pathParts[0].includes(".") ||
  pathParts[0] === "api" ||
  pathParts[0] === "_next" ||
  pathParts[0] === "raw" // This check exists
) {
  return context.next();
}
```

## Why it's not working

Despite `excludedPath = "/raw/*"` and the code check, the edge function still intercepts requests to `/raw/*.md` before static files are served.

According to Netlify docs, edge functions run before redirects and static file serving. The `excludedPath` should prevent the function from running, but it appears the function still executes and may be returning a response that blocks static file access.

## What we've tried

1. Added `excludedPath = "/raw/*"` in netlify.toml
2. Added code-level check in botMeta.ts to skip `/raw/` paths
3. Verified static files exist in `public/raw/` after build
4. Confirmed `_redirects` rule for `/raw/*` is in place
5. Tested with different URLPattern syntax (`/raw/*`, `/**/*.md`)

All attempts result in the same behavior: ChatGPT and Perplexity cannot access the files, while Claude can.

## Why Claude works

Claude's web fetcher may use different headers or handle Netlify's edge function responses differently. It successfully bypasses whatever is blocking ChatGPT and Perplexity.

## The question

How can we configure Netlify edge functions to truly exclude `/raw/*` paths so static markdown files are served directly to all AI crawlers without interception?

Is there a configuration issue with `excludedPath`? Should we use a different approach like header-based matching to exclude AI crawlers from the botMeta function? Or is there a processing order issue where edge functions always run before static files regardless of exclusions?

## Code reference

The CopyPageDropdown component sends these URLs to AI services:

```typescript
const rawMarkdownUrl = `${origin}/raw/${props.slug}.md`;
```

Example: `https://www.markdown.fast/raw/fork-configuration-guide.md`

The files exist. The redirects are configured. The edge function has exclusions. But AI crawlers still cannot access them.

## Help needed

If you've solved this or have suggestions, we'd appreciate guidance. The goal is simple: serve static markdown files at `/raw/*.md` to all clients, including AI crawlers, without edge function interception.

GitHub raw URLs work as a workaround, but we'd prefer to use Netlify-hosted files for consistency and to avoid requiring users to configure GitHub repo details when forking.
