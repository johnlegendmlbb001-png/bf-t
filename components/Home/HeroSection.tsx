"use client";

import GamesPage from "@/app/games/page";
import GameBannerCarousel from "./GameBannerCarousel";
import HomeServices from "./HomeServices";
import TrustHighlights from "./TrustHighlights";
import TopNoticeBanner from "./TopNoticeBanner";
import ScrollingNoticeBand from "./ScrollingNoticeBand";

export default function HeroSection() {


  return (
    <>
     <TopNoticeBanner/>
       <GameBannerCarousel/>
         <ScrollingNoticeBand/>
    <GamesPage/>
      <ScrollingNoticeBand/>
    <div className="p-4 m-2">
    </div>
   
    <HomeServices/>
    <TrustHighlights/>
   
 
    </>

  );
}
