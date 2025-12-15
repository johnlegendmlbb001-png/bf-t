import { NextResponse } from "next/server";

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

    /* ================= FILTER & NORMALIZE ================= */

    const normalizeGame = (game) => {
      if (game?.gameName === "MLBB SMALL/PHP") {
        return {
          ...game,
          gameName: "MLBB SMALL",
        };
      }
      return game;
    };

    /* ================= FILTER FROM GAMES ================= */

    const filteredGames = data?.data?.games
      ?.filter((game) => game.gameSlug !== "test-1637")
      ?.map(normalizeGame);

    /* ================= FILTER FROM CATEGORY ================= */

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
