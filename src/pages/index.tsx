import Image from "next/image";
import "../styles/globals.css";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import Genres from "@/components/custom/genres";
import { ReloadCTX } from "@/contexts/reload";
import { useState, useEffect } from "react";
import NowInCinema from "@/components/custom/nowInCinemaMovies";
import PopularMovies from "@/components/custom/popularMovies";
import { BackdropCTX } from "@/contexts/backdrop";

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
        <div className={`backdrop ${showBackdrop ? 'bg-cover' : ''}`} style={showBackdrop ? { backgroundImage: `url(${showBackdrop})` } : {}}>
        </div>
        <div className="container">
          <div className="flex justify-between items-center h-[80px] mb-[50px]">
            <Image src="/images/logo.png" alt="logo" width={130} height={30} />
            <nav className="flex gap-[30px]">
              <a href="#">Афиша</a>
              <a href="#">Медиа</a>
              <a href="#">Фильмы</a>
              <a href="#">Актёры</a>
              <a href="#">Новости</a>
              <a href="#">Подборки</a>
              <a href="#">Категории</a>
            </nav>
            <div className="flex items-center gap-[12px]">
              <Button className="w-[50px] h-[50px] rounded-[10px] bg-white">
                <CiSearch color="rgba(54, 87, 203, 1)" size={15} />
              </Button>
              <Button className="w-[138px] h-[50px] rounded-[10px] bg-[rgba(54,87,203,1)] shadow-[0px_0px_15px_0px_rgba(72,113,255,0.8)]">
                Войти
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-[90px] mb-[50px]">
              <h1 className="font-[900] text-[65px] text-white">Сейчас в кино</h1>
              <div className="w-[50px] h-[2px] bg-white"></div>
              <Genres />
            </div>
            <NowInCinema />
            <PopularMovies />
          </div>
        </div>
      </BackdropCTX.Provider>
    </ReloadCTX.Provider>
  );
}
