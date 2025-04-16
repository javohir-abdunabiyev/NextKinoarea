import { ReloadCTX } from "@/contexts/reload";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "setMovies":
            return { ...state, movies: action.payload };
        case "setGenres":
            return { ...state, genres: action.payload };
        default:
            return state;
    }
};

function MoviePosters({ id }: { id: any }) {
    const [state, dispatch] = useReducer(reducer, {
        movies: [],
        genres: [],
    });
    const [reload] = useContext(ReloadCTX) || [];
    const swiperRef = useRef<any>(null);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [totalSlides, setTotalSlides] = useState(0);

    useEffect(() => {
        const getTMDBApi = async () => {
            if (!id) return;

            try {
                const [moviesRes, genresRes] = await Promise.all([
                    fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}/similar`,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                            },
                        }
                    ),
                    fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/genre/movie/list?language=ru-RU`,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                            },
                        }
                    ),
                ]);

                const moviesData = await moviesRes.json();
                const genresData = await genresRes.json();

                dispatch({ type: "setMovies", payload: moviesData.results || [] });
                dispatch({ type: "setGenres", payload: genresData.genres || [] });
                setTotalSlides(Math.ceil((moviesData.results?.length || 0) / 4));
            } catch (error) {
                console.error(error);
            }
        };

        getTMDBApi();
    }, [reload, id]);

    const getGenreNames = (genreIds: number[]) => {
        return genreIds
            .map(id => state.genres.find((g: any) => g.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                onSlideChange={(swiper) => {
                    setCurrentSlide(Math.floor(swiper.activeIndex / 4) + 1);
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setTotalSlides(Math.ceil(swiper.slides.length / 4));
                }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {state.movies.map((movie: any, index: number) => (
                    <SwiperSlide key={movie.id}>
                        <Link href={"movie/" + movie.id}>
                            <div className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <Image
                                    src={process.env.NEXT_PUBLIC_BASE_IMG_URL + `${movie.poster_path}`}
                                    alt="movie"
                                    width={300}
                                    height={400}
                                    className="rounded-[10px] mb-[12px] cursor-pointer hover:shadow-[0px_0px_15px_0px_rgba(72,113,255,0.8)] hover:ease-in hover:transition-all duration-100"
                                />
                                <div>
                                    <p className="font-bold text-[18px]">{movie.title}</p>
                                    <p className="text-[rgba(242,246,15,1)] text-[15px]">
                                        {getGenreNames(movie.genre_ids)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="relative flex justify-center items-center mt-4 gap-8">

                <span className="text-[rgba(242,246,15,1)] font-bold text-xl">
                    {Math.min(Math.round(currentSlide), totalSlides)}/{totalSlides}
                </span>

            </div>
        </div>
    );
}

export default MoviePosters;