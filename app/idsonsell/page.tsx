import Link from "next/link";
import Image from "next/image";
import ids from "../../data/idsOnSell.json";

export default function IdsOnSellPage() {
  return (
    <main className="min-h-screen p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">MLBB IDs On Sell</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ids.map((item) => {
          const totalHeroes = item.heroes?.total ?? item.heroes;
          const totalSkins = item.skins?.total ?? item.skins;
          const diamonds = item.diamonds?.doubleDiamondAvailable || [];
          const coa = item.currencies?.coa  ?? 0;
          const hasGlobal = item.heroTitles?.global?.length > 0;

          return (
            <Link
              key={item.id}
              href={`/idsonsell/${item.slug}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white"
            >
              {/* IMAGE */}
              <div className="relative h-40 w-full">
                <Image
                  src={item.media?.images?.[0] || "/logo.png"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2 text-sm">
                {/* TITLE */}
                <h2 className="font-semibold text-base leading-snug">
                  {item.title}
                </h2>

                {/* HERO / SKIN */}
                <div className="flex justify-between text-gray-700">
                  <span>🎭 Heroes: <b>{totalHeroes}+</b></span>
                  <span>🎨 Skins: <b>{totalSkins}+</b></span>
                </div>

                {/* PRICE */}
                <div className="text-lg font-bold text-black">
                  ₹{item.price}
                </div>

                {/* COA & DIAMONDS */}
                <div className="text-xs text-gray-600 space-y-1">
                  <div>💎 COA: <b>{coa}+</b></div>
                  <div>
                    💠 Double Diamonds:{" "}
                    <b>
                      {diamonds.length > 0
                        ? diamonds.join(", ")
                        : "Not Available"}
                    </b>
                  </div>
                </div>

                {/* GLOBAL TAG */}
                {hasGlobal && (
                  <div className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    🌍 Global Hero Available
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
