import { ReloadCTX } from "@/contexts/reload";
import Image from "next/image";
import { useContext, useEffect, useReducer, useState } from "react";
import { Button } from "../ui/button";
import NewTrailers from "./newTrailers";

const reducer = (state, action) => {
    switch (action.type) {
        case "setMovies":
            return { ...state, movies: action.payload };
        case "setGenres":
            return { ...state, genres: action.payload };
        default:
            return state;
    }
};

function PopularMovies() {
    const [state, dispatch] = useReducer(reducer, {
        movies: [],
        genres: [],
    });
    const [reload] = useContext(ReloadCTX);
    const [selectedYear, setSelectedYear] = useState("all")

    useEffect(() => {
        const getTMDBApi = async () => {
            try {
                const [moviesRes, genresRes] = await Promise.all([
                    fetch(
                        process.env.NEXT_PUBLIC_BASE_URL + `/discover/movie?primary_release_year=${selectedYear}`,
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

                console.log(moviesData.results);


                dispatch({ type: "setMovies", payload: moviesData.results });
                dispatch({ type: "setGenres", payload: genresData.genres });
            } catch (error) {
                console.error(error);
            }
        };

        getTMDBApi();
    }, [selectedYear, reload]);

    const getGenreNames = (ids: number[]) => {
        return ids
            .map((id) => state.genres.find((g: any) => g.id === id)?.name)
            .filter(Boolean)
            .join(", ");
    };


    return (
        <>
            <div className="flex items-center gap-[90px] mb-[50px] mt-[100px]">
                <h1 className="font-[900] text-[45px] text-white mb-[40px]">Популярные фильмы</h1>
                <div className="w-[50px] h-[2px] bg-white"></div>
                <div className="flex gap-[20px] items-center">
                    {["all", "2020", "2019", "2018", "2017", "2016", "2015"].map((year) => (
                        <p
                            key={year}
                            className={`text-gray-400 font-[700] cursor-pointer ${selectedYear === year ? 'text-white' : ''}`}
                            onClick={() => setSelectedYear(year)}
                        >
                            {year === "all" ? "Всё время" : year}
                        </p>
                    ))}
                </div>
            </div>
            <div className="flex gap-[22px] justify-center">
                {state.movies.slice(8, 12).map((movie: any, index: number) => (
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
                ))}
            </div>
        </>
    );
}

export default PopularMovies;