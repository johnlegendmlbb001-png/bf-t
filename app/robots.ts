export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin",
          "/dashboard",
        ],
      },
    ],
    sitemap: [
      "https://mlbbtopup.in/sitemap.xml",
      "https://mlbbtopup.in/sitemap.txt",
    ],
  };
}
