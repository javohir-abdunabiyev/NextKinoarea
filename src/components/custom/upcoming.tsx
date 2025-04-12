import { ReloadCTX } from "@/contexts/reload";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useReducer, useState } from "react";

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

function UpComing() {
    const [state, dispatch] = useReducer(reducer, {
        movies: [],
        genres: [],
    });
    const [reload] = useContext(ReloadCTX);

    useEffect(() => {
        const getTMDBApi = async () => {
            try {
                const [moviesRes, genresRes] = await Promise.all([
                    fetch(
                        process.env.NEXT_PUBLIC_BASE_URL + "/movie/upcoming?language=ru-RU",
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                            },
                        }
                    ),
                    fetch(
                        process.env.NEXT_PUBLIC_BASE_URL + "/genre/movie/list?language=ru-RU",
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                            },
                        }
                    ),
                ]);

                const moviesData = await moviesRes.json();
                const genresData = await genresRes.json();

                dispatch({ type: "setMovies", payload: moviesData.results });
                dispatch({ type: "setGenres", payload: genresData.genres });
            } catch (error) {
                console.error(error);
            }
        };

        getTMDBApi();
    }, [reload]);

    const getGenreNames = (ids: number[]) => {
        return ids
            .map((id) => state.genres.find((g: any) => g.id === id)?.name)
            .filter(Boolean)
            .join(", ");
    };

    return (
        <>
            <h1 className="text-[40px] font-[900] text-white mb-[70px]">Ожидаемые новинки</h1>
            <div className="grid grid-cols-4 gap-[22px] justify-center">
                {state.movies.slice(0, 4).map((movie: any, index: number) => (
                    <Link href={"/movie/" + movie.id}>
                        <div key={movie.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
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
                ))}

            </div>
        </>
    );
}

export default UpComing;