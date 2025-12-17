"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";

export default function GameBannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;

    fetch("/api/game-banners")
      .then((r) => r.json())
      .then((d) => mounted && setBanners(d?.data ?? []))
      .catch(() => mounted && setBanners([]))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (!banners.length) return;

    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % banners.length);
    }, 5000);

    return () => clearInterval(id);
  }, [banners.length]);

  /* ================= MOUSE PARALLAX (NO RE-RENDER) ================= */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    };

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.style.transform = `
            rotateY(${mouseRef.current.x * 3}deg)
            rotateX(${-mouseRef.current.y * 3}deg)
          `;
        }
        rafRef.current = null;
      });
    }
  };

  /* ================= NAV ================= */
  const goNext = () =>
    banners.length && setCurrent((p) => (p + 1) % banners.length);
  const goPrev = () =>
    banners.length && setCurrent((p) => (p - 1 + banners.length) % banners.length);

  const handleThumb = (i: number) => {
    setCurrent(i);
    setClickedIndex(i);
    setTimeout(() => setClickedIndex(null), 250);
  };

  /* ================= ONLY 3 SLIDES ================= */
  const visibleIndexes = useMemo(() => {
    if (!banners.length) return [];
    return [
      (current - 1 + banners.length) % banners.length,
      current,
      (current + 1) % banners.length,
    ];
  }, [current, banners.length]);

  /* ================= RENDER ================= */
  if (loading) return <Loader />;
  if (!banners.length) return null;

  return (
    <div className="relative max-w-7xl mx-auto mt-12 px-4 select-none">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative transition-transform duration-300"
        style={{ perspective: "2000px" }}
      >
        <div className="relative h-[240px] md:h-[380px] rounded-[30px] overflow-hidden border border-white/10 bg-black shadow-2xl">
          {visibleIndexes.map((i) => {
            const banner = banners[i];
            const isActive = i === current;

            return (
              <Link
                key={i}
                href="/"
                className={`absolute inset-0 transition-all duration-700 ${
                  isActive
                    ? "opacity-100 scale-100 z-30"
                    : "opacity-30 scale-90 blur z-20"
                }`}
              >
                <Image
                  src={banner.bannerImage || logo}
                  alt={banner.bannerTitle}
                  fill
                  priority={isActive}
                  loading={isActive ? "eager" : "lazy"}
                  sizes="(max-width:768px) 100vw, 1200px"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {isActive && (
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2">
                      {banner.bannerTitle}
                    </h2>
                    <p className="text-gray-300 max-w-xl mb-4">
                      {banner.bannerDescription || "Discover amazing games"}
                    </p>
                    <button className="w-fit px-6 py-3 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition">
                      Buy Now →
                    </button>
                  </div>
                )}
              </Link>
            );
          })}

          {/* NAV */}
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/10"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/10"
          >
            ›
          </button>
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-6 justify-center overflow-x-auto">
        {banners.map((b, i) => (
          <button
            key={i}
            onClick={() => handleThumb(i)}
            className={`relative transition ${
              current === i ? "scale-100" : "scale-75 opacity-50"
            } ${clickedIndex === i ? "translate-y-1" : ""}`}
          >
            <div className="w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden border border-white/20">
              <Image
                src={b.bannerImage || logo}
                alt={b.bannerTitle}
                fill
                loading="lazy"
                sizes="200px"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {/* PROGRESS */}
      <div className="text-center mt-4 text-sm text-gray-400">
        {current + 1} / {banners.length}
      </div>
    </div>
  );
}
