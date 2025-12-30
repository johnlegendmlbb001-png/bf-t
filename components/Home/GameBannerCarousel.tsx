"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import Loader from "@/components/Loader/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GameBannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

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
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % banners.length),
      6000
    );
    return () => clearInterval(id);
  }, [banners.length]);

  /* ================= PARALLAX ================= */
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
            rotateY(${mouseRef.current.x * 2}deg)
            rotateX(${-mouseRef.current.y * 2}deg)
          `;
        }
        rafRef.current = null;
      });
    }
  };

  const goNext = () =>
    banners.length && setCurrent((p) => (p + 1) % banners.length);
  const goPrev = () =>
    banners.length &&
    setCurrent((p) => (p - 1 + banners.length) % banners.length);

  const visibleIndexes = useMemo(() => {
    if (!banners.length) return [];
    return [
      (current - 1 + banners.length) % banners.length,
      current,
      (current + 1) % banners.length,
    ];
  }, [current, banners.length]);

  if (loading) return <Loader />;
  if (!banners.length) return null;

  return (
    <section className="relative max-w-7xl mx-auto mt-14 px-4">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="transition-transform duration-300"
        style={{ perspective: "2000px" }}
      >
        <div className="relative h-[260px] md:h-[420px] rounded-[32px] overflow-hidden bg-black border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

          {/* SLIDES */}
          {visibleIndexes.map((i) => {
            const banner = banners[i];
            const isActive = i === current;

            return (
              <Link
                key={i}
                href="/"
                className={`absolute inset-0 transition-all duration-700 ease-out
                  ${isActive
                    ? "opacity-100 scale-100 z-30"
                    : "opacity-0 scale-105 z-10"}
                `}
              >
                <Image
                  src={banner.bannerImage || logo}
                  alt={banner.bannerTitle}
                  fill
                  priority={isActive}
                  className="object-cover"
                />

                {/* OVERLAYS */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {isActive && (
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                      {banner.bannerTitle}
                    </h2>

                    <p className="mt-3 max-w-xl text-gray-300 text-sm md:text-base">
                      {banner.bannerDescription ||
                        "Top-up instantly. Secure. Trusted."}
                    </p>

                    <button className="mt-6 w-fit px-8 py-3 rounded-full font-bold text-white
                      bg-gradient-to-r from-purple-500 to-pink-500
                      shadow-lg shadow-pink-500/30
                      hover:scale-105 hover:shadow-pink-500/50
                      transition-all">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40
              w-12 h-12 rounded-full
              bg-black/40 backdrop-blur
              border border-white/10
              flex items-center justify-center
              hover:bg-white/10 transition"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40
              w-12 h-12 rounded-full
              bg-black/40 backdrop-blur
              border border-white/10
              flex items-center justify-center
              hover:bg-white/10 transition"
          >
            <ChevronRight className="text-white" />
          </button>
        </div>
      </div>

      {/* THUMBNAILS */}
      <div className="flex justify-center gap-4 mt-6">
        {banners.map((b, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`relative transition-all
              ${current === i ? "scale-100" : "scale-90 opacity-50 hover:opacity-80"}
            `}
          >
            <div className={`w-24 md:w-32 h-16 md:h-20 rounded-xl overflow-hidden
              border ${current === i ? "border-pink-500 shadow-pink-500/40 shadow-lg" : "border-white/10"}
            `}>
              <Image
                src={b.bannerImage || logo}
                alt={b.bannerTitle}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {/* PROGRESS BAR */}
      <div className="mt-4 h-[3px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${((current + 1) / banners.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
