import Footer from "@/components/custom/footer";
import MoviePosters from "@/components/custom/moviePosters";
import { ReloadCTX } from "@/contexts/reload";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useContext, useEffect, useReducer } from "react";

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "getActor":
            return { ...state, actor: action.payload };
        case "getImages":
            return { ...state, images: action.payload };
        case "getMovies":
            return { ...state, movies: action.payload };
        default:
            return state;
    }
};

function Actor() {
    const [state, dispatch] = useReducer(reducer, {
        actor: null,
        images: [],
        movies: []
    });

    const [reload] = useContext(ReloadCTX) || [];
    const params = useParams();

    useEffect(() => {
        const getTMDBApi = async () => {
            if (!params?.id) return;

            try {
                const [actorRes, imagesRes, moviesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/person/${params.id}?language=ru-RU`, {
                        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/person/${params.id}/images`, {
                        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/person/${params.id}/movie_credits`, {
                        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}` }
                    })
                ]);

                const [actorData, imagesData, moviesData] = await Promise.all([
                    actorRes.json(),
                    imagesRes.json(),
                    moviesRes.json()
                ]);

                dispatch({ type: "getActor", payload: actorData });
                dispatch({ type: "getImages", payload: imagesData.profiles || [] });
                dispatch({ type: "getMovies", payload: moviesData.cast || [] });

            } catch (error) {
                console.error(error);
            }
        };

        getTMDBApi();
    }, [reload, params?.id]);

    // Получаем массив ID фильмов
    const movieIds = state.movies.map((movie: any) => movie.id);

    return (
        <>
            {state.actor && (
                <div className="flex flex-col items-center">
                    {/* Информация об актере */}
                    <div className="flex justify-center gap-[50px] w-full max-w-6xl mb-10">
                        <Image
                            src={process.env.NEXT_PUBLIC_BASE_IMG_URL + `${state.actor.profile_path}`}
                            alt="actor"
                            width={350}
                            height={400}
                            className="rounded-[10px] mb-[12px] cursor-pointer hover:shadow-[0px_0px_15px_0px_rgba(72,113,255,0.8)] hover:ease-in hover:transition-all duration-100"
                        />
                        <div>
                            <h3 className="text-[40px] font-[900] text-white mb-[10px]">{state.actor.name}</h3>
                            <p className="text-gray-400 text-[19px] mb-[20px]">Карьера: {state.actor.known_for_department}</p>
                            <p className="text-gray-400 text-[19px] mb-[20px]">Дата рождения: {state.actor.birthday}</p>
                            <p className="text-gray-400 text-[19px] mb-[20px]">Место рождения: {state.actor.place_of_birth}</p>
                        </div>
                    </div>

                    {/* Галерея фото */}
                    {state.images.length > 0 && (
                        <div className="w-full max-w-6xl">
                            <h4 className="text-[40px] font-[900] text-white mb-[10px]">Фото</h4>
                            <div className="grid grid-cols-3 gap-[30px]">
                                {state.images.slice(0, 6).map((image: any) => (
                                    <div key={image.file_path} className="w-full h-full">
                                        <Image
                                            src={process.env.NEXT_PUBLIC_BASE_IMG_URL + image.file_path}
                                            alt={state.actor.name}
                                            width={300}
                                            height={450}
                                            className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Секция с фильмами - передаем массив ID один раз */}
            {state.movies.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-[40px] font-[900] text-white mb-[10px]">Фильмы</h3>
                    <MoviePosters id={movieIds} />
                </div>
            )}

            <Footer />
        </>
    );
}

export default Actor;