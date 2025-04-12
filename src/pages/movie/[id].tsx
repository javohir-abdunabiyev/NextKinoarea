import { ReloadCTX } from "@/contexts/reload";
import { useParams } from "next/navigation";
import { useContext, useEffect, useReducer } from "react";
import "./style.css"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MovieActors from "@/components/custom/actors";
import Footer from "@/components/custom/footer";

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "setMovie":
            return { ...state, movie: action.payload };
        case "setGenres":
            return { ...state, genres: action.payload };
        default:
            return state;
    }
};

function Movie() {
    const params = useParams();
    const [state, dispatch] = useReducer(reducer, {
        movie: {},
        genres: [],
    });
    const [reload] = useContext(ReloadCTX) || [];

    useEffect(() => {
        const getTMDBApi = async () => {
            if (!params?.id) return;

            try {
                const [movieRes, genresRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/movie/${params.id}?language=ru-RU`, {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/genre/movie/list?language=ru-RU`, {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                    }),
                ]);

                if (!movieRes.ok || !genresRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const movieData = await movieRes.json();
                const genresData = await genresRes.json();

                console.log(movieData);


                dispatch({ type: "setMovie", payload: movieData });
                dispatch({ type: "setGenres", payload: genresData.genres });
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        getTMDBApi();
    }, [reload, params?.id]);

    return (
        <>
            <div className="backdrop"
                style={{
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_IMG_URL}${state.movie.backdrop_path})`
                }}
            ></div>
            <div>
                <div className="flex gap-[60px] justify-center items-center">
                    <Image
                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + `${state.movie.poster_path}`}
                        alt="movie"
                        width={350}
                        height={400}
                        className="rounded-[10px] mb-[12px] cursor-pointer hover:shadow-[0px_0px_15px_0px_rgba(72,113,255,0.8)] hover:ease-in hover:transition-all duration-100"
                    />
                    <div>
                        <h1 className="text-[40px] font-[900] text-white mb-[10px]">{state.movie.title}</h1>
                        <p className="mb-[10px] text-[20px]">{state.movie.original_title}</p>
                        <p className="text-[20px] font-bold text-[rgba(242,246,15,1)] mb-[10px]">Рейтинг : {state.movie.vote_average}</p>
                        <p className="text-[17px] max-w-[700px]">{state.movie.overview}</p>
                        <a href="">
                            <Button className="w-[260px] h-[70px] bg-[] hover:bg-[] border-[2px] cursor-pointer mt-[20px]">Смотреть трейлер</Button>
                        </a>
                    </div>
                </div>
                <div className="flex justify-center items-center gap-[60px]">
                    <div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Год:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{state.movie.release_date}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Страна:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{state.movie.origin_country}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Слоган:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{state.movie.tagline}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Режиссер</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Сценарий:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Продюсер:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Оператор:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Композитор:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                    </div>
                    <div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Художник:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Монтаж:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between">
                            <p className="text-[18px] font-[600] max-w-[200px] w-full">Жанры:</p>
                            <p className="max-w-[350px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">
                                {state.movie.genres?.map((genre: any, index: number) => (
                                    <span key={index}>
                                        {genre.name}
                                        {index < state.movie.genres.length - 1 && ", "}
                                    </span>
                                ))}                            </p>
                        </div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Сборы в мире:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">${state.movie.budget}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Премьера (мир):</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{state.movie.release_date}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Премьера (РФ):</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{state.movie.release_date}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Возраст:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{""}</p></div>
                        <div className="flex max-w-[700px] w-full justify-between"><p className="text-[18px] font-[600] max-w-[200px] w-full">Время:</p><p className="max-w-[450px] w-full text-left font-[400] text-[rgba(242,246,15,1)]">{state.movie.runtime} мин.</p></div>
                    </div>
                </div>
                <div>
                    <h2 className="text-[40px] font-[900] text-white mb-[70px] mt-[50px]">В главных ролях:</h2>
                    <MovieActors id={state.movie.id} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Movie;