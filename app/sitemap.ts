export default function sitemap() {
  const baseUrl = "https://mlbbtopup.in";
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }, {
      url: `${baseUrl}/region`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games/mobile-legends988`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
      {
      url: `${baseUrl}/games/mlbb-double332`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
     {
      url: `${baseUrl}/games/mlbb-smallphp178`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
     {
      url: `${baseUrl}/games/sgmy-mlbb893`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
     {
      url: `${baseUrl}/games/magic-chess-gogo-india924`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
     {
      url: `${baseUrl}/games/mlbb-russia953`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
