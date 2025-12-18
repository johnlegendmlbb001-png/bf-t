import { NextResponse } from "next/server";

const MLBB_MAIN_IMAGE =
  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1766076026/7fd445965237d07c1583c1dfb0ee9517_bp14p4.jpg";

const MLBB_SMALL_IMAGE =
  "https://res.cloudinary.com/dk0sslz1q/image/upload/v1766076026/e5467ac4556c15c54810e9a78c0d7950_1_dvzsmd.jpg";

export async function GET() {
  try {
    const response = await fetch(
      "https://1gamestopup.com/api/v1/game",
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.API_SECRET_KEY,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    /* ================= NORMALIZE GAME ================= */
    const normalizeGame = (game) => {
      let updatedGame = { ...game };

      // Rename MLBB SMALL/PHP → MLBB SMALL
      if (updatedGame.gameName === "MLBB SMALL/PHP") {
        updatedGame.gameName = "MLBB SMALL";
      }
  // Fix wrong publisher name
  if (updatedGame.gameFrom === "Moneyton") {
    updatedGame.gameFrom = "Moontoon";
  }
      // Replace Mobile Legends main image
      if (updatedGame.gameSlug === "mobile-legends988") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_MAIN_IMAGE,
        };
      }

      // Replace MLBB SMALL image
      if (updatedGame.gameName === "MLBB SMALL") {
        updatedGame.gameImageId = {
          ...updatedGame.gameImageId,
          image: MLBB_SMALL_IMAGE,
        };
      }

      return updatedGame;
    };

    /* ================= FILTER GAMES ================= */
    const filteredGames = data?.data?.games
      ?.filter((game) => game.gameSlug !== "test-1637")
      ?.map(normalizeGame);

    /* ================= FILTER CATEGORY GAMES ================= */
    const filteredCategories = data?.data?.category?.map((cat) => ({
      ...cat,
      gameId: cat.gameId
        ?.filter((game) => game.gameSlug !== "test-1637")
        ?.map(normalizeGame),
    }));

    return NextResponse.json({
      ...data,
      data: {
        ...data.data,
        games: filteredGames,
        category: filteredCategories,
        totalGames: filteredGames?.length ?? 0,
      },
    });
  } catch (error) {
    console.error("GAME API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch game list",
      },
      { status: 500 }
    );
  }
}
