/**
 * Deduces Next.js App Router file paths from the active browser pathname
 */
export function getTargetFilePath(pathname: string): {
  filePath: string;
  componentName: string;
  isArticle: boolean;
} {
  const cleanPath = (pathname || "/").replace(/\/$/, "") || "/";

  if (cleanPath === "/") {
    return {
      filePath: "src/app/page.tsx",
      componentName: "HomePage",
      isArticle: false,
    };
  }

  const segments = cleanPath.split("/").filter(Boolean);

  // Check for common dynamic patterns (e.g. /blog/my-recipe-slug -> app/blog/[slug]/page.tsx)
  if (segments[0] === "blog" && segments.length > 1) {
    return {
      filePath: "src/app/blog/[slug]/page.tsx",
      componentName: "BlogPostPage",
      isArticle: true,
    };
  }

  if (segments[0] === "docs" && segments.length > 1) {
    return {
      filePath: "src/app/docs/[slug]/page.tsx",
      componentName: "DocsPage",
      isArticle: true,
    };
  }

  // Dashboard routes
  if (segments[0] === "dashboard") {
    const sub = segments.slice(1).join("/");
    return {
      filePath: sub ? `src/app/(dashboard)/dashboard/${sub}/page.tsx` : `src/app/(dashboard)/dashboard/page.tsx`,
      componentName: "DashboardPage",
      isArticle: false,
    };
  }

  // Standard route: e.g. /calculator -> src/app/calculator/page.tsx
  return {
    filePath: `src/app/${segments.join("/")}/page.tsx`,
    componentName: `${segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1)}Page`,
    isArticle: false,
  };
}

/**
 * Finds the closest semantic context description for a target DOM element
 */
export function getElementLocationContext(targetEl: HTMLElement | null): {
  parentContainer: string;
  contextHint: string;
} {
  if (!targetEl) {
    return {
      parentContainer: "Page Body",
      contextHint: "Inside main JSX return",
    };
  }

  // Check for closest semantic section
  const section = targetEl.closest("section, article, header, aside, [data-section], .hero");
  if (section) {
    const heading = section.querySelector("h1, h2, h3")?.textContent?.trim();
    if (heading) {
      return {
        parentContainer: `<section> ("${heading.slice(0, 30)}...")`,
        contextHint: `Directly under section: "${heading.slice(0, 30)}..."`,
      };
    }
    if (section.tagName === "ARTICLE" || section.classList.contains("adinject-article-body")) {
      return {
        parentContainer: "<article> Content Body",
        contextHint: "Between article text paragraphs",
      };
    }
  }

  const tag = targetEl.tagName.toLowerCase();
  const text = targetEl.textContent?.trim() || "";

  return {
    parentContainer: `<${tag}> element`,
    contextHint: text ? `Immediately below: "${text.slice(0, 35)}..."` : `Below <${tag}>`,
  };
}
