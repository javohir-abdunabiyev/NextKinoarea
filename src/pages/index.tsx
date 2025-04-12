import Genres from "@/components/custom/genres";
import { ReloadCTX } from "@/contexts/reload";
import { useState, useEffect } from "react";
import NowInCinema from "@/components/custom/nowInCinemaMovies";
import PopularMovies from "@/components/custom/popularMovies";
import { BackdropCTX } from "@/contexts/backdrop";
import Persons from "@/components/custom/persons";
import UpComing from "@/components/custom/upcoming";
import Footer from "@/components/custom/footer";

export default function Home() {
  const [reload, setReload] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState<string | null>(null);

  useEffect(() => {
    const backdropPath = localStorage.getItem("movieBackdropPath");
    if (backdropPath) {
      setShowBackdrop(`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${backdropPath}`);
    } else {
      setShowBackdrop(null);
    }
  }, []);

  return (
    <ReloadCTX.Provider value={[reload, setReload]}>
      <BackdropCTX.Provider value={{ showBackdrop, setShowBackdrop }}>
        <div className={`${showBackdrop ? 'bg-cover' : ''}`} style={showBackdrop ? { backgroundImage: `url(${showBackdrop})` } : {}}>
        </div>
        <div className="container">
          <div>
            <div className="flex items-center gap-[90px] mb-[50px]">
              <h1 className="font-[900] text-[65px] text-white">Сейчас в кино</h1>
              <div className="w-[50px] h-[2px] bg-white"></div>
              <Genres />
            </div>
            <NowInCinema />
            <PopularMovies />
            <Persons />
            <UpComing />
          </div>
        </div>
        <Footer />
      </BackdropCTX.Provider>
    </ReloadCTX.Provider>
  );
}
