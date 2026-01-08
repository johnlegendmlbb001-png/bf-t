"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiFilter, FiX, FiSearch, FiGrid, FiList } from "react-icons/fi";

import GameGrid from "@/components/Games/GameGrid";
import GameList from "@/components/Games/GameList";
import FilterModal from "@/components/Games/FilterModal";

export default function GamesPage() {
  /* ================= STATE ================= */
  const [category, setCategory] = useState([]);
  const [games, setGames] = useState([]);
  const [otts, setOtts] = useState(null);
  const [memberships, setMemberships] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [sort, setSort] = useState("az");
  const [hideOOS, setHideOOS] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= CONFIG ================= */
  const SPECIAL_MLBB_GAME = "MLBB SMALL";
  const WEEKLY_PASS_SLUG = "mobile-legends988";

  const outOfStockGames = [
    "Genshin Impact",
    "Honor Of Kings",
    "TEST 1",
    "Wuthering of Waves",
    "Where Winds Meet",
  ];

  const outOfStockSet = useMemo(() => new Set(outOfStockGames), []);

  const isOutOfStock = useCallback(
    (name) => outOfStockSet.has(name),
    [outOfStockSet]
  );

  /* ================= FETCH ================= */
  useEffect(() => {
    let mounted = true;

    const loadGames = async () => {
      try {
        const res = await fetch("/api/games");
        const json = await res.json();
        if (!mounted) return;

        let fetchedGames = json?.data?.games || [];

        // Clone PUBG → BGMI
        const pubg = fetchedGames.find(
          (g) => g.gameName === "PUBG Mobile"
        );
        if (pubg && !fetchedGames.some((g) => g.gameSlug === "bgmi")) {
          fetchedGames.push({
            ...pubg,
            gameName: "BGMI",
            gameSlug: "bgmi",
          });
        }

        // Duplicate Weekly Pass (same slug)
        const weeklyPassSource = fetchedGames.find(
          (g) => g.gameSlug === WEEKLY_PASS_SLUG
        );

        if (weeklyPassSource) {
          const alreadyExists = fetchedGames.some(
            (g) =>
              g.gameSlug === WEEKLY_PASS_SLUG &&
              g.gameName === "Weekly Pass"
          );

          if (!alreadyExists) {
            fetchedGames.push({
              ...weeklyPassSource,
              gameName: "Weekly Pass",
              _variant: "weekly-pass",
            });
          }
        }

        setCategory(json?.data?.category || []);
        setGames(fetchedGames);
        setOtts(json?.data?.otts || null);
        setMemberships(json?.data?.memberships || null);
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    };

    loadGames();
    return () => (mounted = false);
  }, []);

  /* ================= FILTER COUNT ================= */
  const activeFilterCount =
    (sort !== "az" ? 1 : 0) + (hideOOS ? 1 : 0);

  /* ================= GLOBAL GAME PROCESSING ================= */
  const processedGames = useMemo(() => {
    let list = [...games];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((g) =>
        g.gameName.toLowerCase().includes(q)
      );
    }

    if (hideOOS) {
      list = list.filter((g) => !isOutOfStock(g.gameName));
    }

    if (sort === "az") {
      list.sort((a, b) =>
        a.gameName.localeCompare(b.gameName)
      );
    } else if (sort === "za") {
      list.sort((a, b) =>
        b.gameName.localeCompare(a.gameName)
      );
    }

    return list;
  }, [games, searchQuery, hideOOS, sort, isOutOfStock]);

  /* ================= CATEGORY PROCESSING ================= */
  const processedCategories = useMemo(() => {
    return category.map((cat) => {
      let list = [...cat.gameId];

      if (
        cat.categoryTitle
          ?.toLowerCase()
          .includes("mobile legends")
      ) {
        const weeklyPass = games.find(
          (g) =>
            g.gameName === "Weekly Pass" &&
            g.gameSlug === WEEKLY_PASS_SLUG
        );

        const mlbbSmall = games.find(
          (g) => g.gameName === SPECIAL_MLBB_GAME
        );

        // remove duplicates first
        list = list.filter(
          (g) =>
            g.gameName !== "Weekly Pass" &&
            g.gameName !== SPECIAL_MLBB_GAME
        );

        // order: Weekly Pass → MLBB SMALL → rest
        if (weeklyPass) list.unshift(weeklyPass);
        if (mlbbSmall)
          list.splice(weeklyPass ? 1 : 0, 0, mlbbSmall);
      }

      const filtered = list.filter((g) =>
        processedGames.some(
          (pg) =>
            pg.gameSlug === g.gameSlug &&
            (pg._variant === g._variant || !pg._variant)
        )
      );

      return { ...cat, games: filtered };
    });
  }, [category, games, processedGames]);

  /* ================= HANDLERS ================= */
  const clearFilters = () => {
    setSort("az");
    setHideOOS(false);
  };

  /* ================= RENDER ================= */
  return (
    <section className="min-h-screen px-4 py-10 bg-[var(--background)] text-[var(--foreground)]">
      {/* ================= TOP BAR ================= */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="flex p-1 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)]"
                }`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--muted)]"
                }`}
              >
                <FiList />
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl border border-red-500/50 text-red-400"
              >
                <FiX />
              </button>
            )}

            <button
              onClick={() => setShowFilter(true)}
              className="relative px-4 py-2 rounded-xl border border-[var(--border)]"
            >
              <FiFilter />
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-[var(--accent)] text-white rounded-full px-2">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      {processedCategories.map((cat, i) => {
        if (!cat.games.length) return null;

        return (
          <div key={i} className="max-w-7xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-6">
              {cat.categoryTitle}
            </h2>

            {viewMode === "grid" ? (
              <GameGrid
                games={cat.games}
                isOutOfStock={isOutOfStock}
              />
            ) : (
              <GameList
                games={cat.games}
                isOutOfStock={isOutOfStock}
              />
            )}
          </div>
        );
      })}

      {/* ================= ALL GAMES ================= */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          All Games ({processedGames.length})
        </h2>

        {viewMode === "grid" ? (
          <GameGrid
            games={processedGames}
            isOutOfStock={isOutOfStock}
          />
        ) : (
          <GameList
            games={processedGames}
            isOutOfStock={isOutOfStock}
          />
        )}
      </div>
{otts?.items?.length > 0 && (
  <div className="max-w-7xl mx-auto mb-14">
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">
        {otts.title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
      <span className="text-sm text-[var(--muted)]">
        {otts.total} services
      </span>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {otts.items.map((ott) => (
        <Link
          key={ott.slug}
          href={`/games/ott/${ott.slug}`}
          className="group rounded-2xl bg-[var(--card)]
                     border border-[var(--border)]
                     hover:border-[var(--accent)]
                     transition-all duration-300
                     p-5 flex flex-col items-center text-center"
        >
          <div className="relative w-20 h-20 mb-4">
            <Image
              src={ott.image}
              alt={ott.name}
              fill
              className="object-contain"
            />
          </div>

          <h3 className="font-semibold text-[var(--foreground)]">
            {ott.name}
          </h3>

          <span className="mt-1 text-xs text-[var(--muted)]">
            {ott.category}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}

{/* ================= MEMBERSHIP SECTION ================= */}
{memberships?.items?.length > 0 && (
  <div className="max-w-7xl mx-auto mb-14">
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">
        {memberships.title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
      <span className="text-sm text-[var(--muted)]">
        {memberships.total} plans
      </span>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {memberships.items.map((plan) => (
        <Link
          key={plan.slug}
          href={`/games/membership/${plan.slug}`}
          className="group rounded-2xl bg-[var(--card)]
                     border border-[var(--border)]
                     hover:border-[var(--accent)]
                     transition-all duration-300
                     p-5 flex flex-col items-center text-center"
        >
          <div className="relative w-20 h-20 mb-4">
            <Image
              src={plan.image}
              alt={plan.name}
              fill
              className="object-contain"
            />
          </div>

          <h3 className="font-semibold text-[var(--foreground)]">
            {plan.name}
          </h3>

          <span className="mt-1 text-xs text-[var(--muted)]">
            {plan.duration}
          </span>
        </Link>
      ))}
    </div>
  </div>
)}
      {/* ================= FILTER MODAL ================= */}
      {showFilter && (
        <FilterModal
          open={showFilter}
          onClose={() => setShowFilter(false)}
          sort={sort}
          setSort={setSort}
          hideOOS={hideOOS}
          setHideOOS={setHideOOS}
        />
      )}
    </section>
  );
}
