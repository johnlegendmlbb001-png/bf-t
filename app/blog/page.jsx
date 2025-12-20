"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FiFilter,
  FiX,
  FiSearch,
  FiClock,
  FiCalendar,
  FiStar,
  FiTag,
} from "react-icons/fi";

/* ================= BLOG DATA ================= */
const BLOGS_DATA = [
  {
    id: "1",
    title: "MLBB Weekly Pass Price in India (2025)",
    slug: "mlbb-weekly-pass-price-in-india",
    type: "Guide",
    excerpt:
      "Learn the latest MLBB weekly pass price in India, benefits, and whether it’s worth buying for regular players.",
    publishedAt: "2025-01-10",
    updatedAt: "2025-01-10",
    readingTime: "4 min read",
    tags: ["weekly pass", "pricing", "india"],
    featured: true,
  },
  {
    id: "2",
    title: "How to Buy MLBB Diamonds Safely in India",
    slug: "how-to-buy-mlbb-diamonds-safely-in-india",
    type: "Safety",
    excerpt:
      "A step-by-step guide to buying MLBB diamonds safely in India and avoiding common online scams.",
    publishedAt: "2025-01-12",
    updatedAt: "2025-01-12",
    readingTime: "5 min read",
    tags: ["diamonds", "safety", "top-up"],
    featured: true,
  },
  {
    id: "3",
    title: "Is MLBB Top-Up Legal in India?",
    slug: "is-mlbb-top-up-legal-in-india",
    type: "Info",
    excerpt:
      "Understand whether MLBB top-ups are legal in India and how to recharge without risking your account.",
    publishedAt: "2025-01-05",
    updatedAt: "2025-01-05",
    readingTime: "3 min read",
    tags: ["legal", "india", "mlbb"],
    featured: false,
  },
];

/* ================= HELPERS ================= */
const isNewPost = (date) =>
  Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000;

/* ================= PAGE ================= */
export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("latest");
  const [showFilter, setShowFilter] = useState(false);

  const filteredBlogs = useMemo(() => {
    let blogs = [...BLOGS_DATA];

    if (search)
      blogs = blogs.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase())
      );

    if (type !== "all") blogs = blogs.filter((b) => b.type === type);

    blogs.sort((a, b) =>
      sort === "latest"
        ? +new Date(b.publishedAt) - +new Date(a.publishedAt)
        : +new Date(a.publishedAt) - +new Date(b.publishedAt)
    );

    return blogs;
  }, [search, type, sort]);

  return (
    <section className="min-h-screen bg-[var(--background)] px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* ================= HEADER ================= */}
        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
            MLBB Blogs & Guides
          </h1>
          <p className="text-[var(--muted)] max-w-2xl">
            Deep-researched MLBB guides, pricing insights, and safety tips for Indian players.
          </p>
        </header>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border bg-[var(--card)] focus:border-[var(--accent)] outline-none transition"
            />
          </div>

          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-[var(--card)] hover:border-[var(--accent)] transition"
          >
            <FiFilter />
            Filters
          </button>
        </div>

        {/* ================= BLOG GRID ================= */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className={`group relative block rounded-2xl p-6 border bg-[var(--card)]
              transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
              ${blog.featured ? "ring-2 ring-[var(--accent)]/40" : ""}`}
            >
              {/* FEATURED ICON */}
              {blog.featured && (
                <FiStar className="absolute top-4 right-4 text-[var(--accent)]" />
              )}

              {/* META */}
              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                <span className="px-2 py-1 rounded bg-[var(--accent)] text-black font-semibold">
                  {blog.type}
                </span>

                {isNewPost(blog.publishedAt) && (
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-500">
                    New
                  </span>
                )}
              </div>

              <h2 className="text-xl font-semibold group-hover:text-[var(--accent)] transition">
                {blog.title}
              </h2>

              <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2">
                {blog.excerpt}
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-[var(--background)] border"
                  >
                    <FiTag size={12} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-5 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <FiClock />
                  {blog.readingTime}
                </span>
                <span className="flex items-center gap-1">
                  <FiCalendar />
                  {new Date(blog.publishedAt).toDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ================= FILTER MODAL ================= */}
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-end sm:items-center">
          <div className="w-full sm:max-w-md bg-[var(--card)] rounded-t-2xl sm:rounded-2xl p-6 space-y-6 animate-slideUp">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filter Blogs</h3>
              <button onClick={() => setShowFilter(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div>
              <label className="text-sm text-[var(--muted)]">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full px-4 py-2 rounded-xl border bg-transparent"
              >
                <option value="all">All</option>
                <option value="Guide">Guide</option>
                <option value="Safety">Safety</option>
                <option value="Info">Info</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-[var(--muted)]">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-2 w-full px-4 py-2 rounded-xl border bg-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <button
              onClick={() => setShowFilter(false)}
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-black font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
