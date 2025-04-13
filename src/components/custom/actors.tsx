import { ReloadCTX } from "@/contexts/reload";
import Image from "next/image";
import { useContext, useEffect, useReducer, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";


const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "get_credits":
            return { ...state, cast: action.payload?.cast || [] };
        case "get_videos":
            const trailer = action.payload?.results?.find(
                (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
            );
            return {
                ...state,
                videos: action.payload?.results || [],
                trailerKey: trailer?.key || null,
            };
        default:
            return state;
    }
};

function MovieActors({ id }: { id: unknown }) {
    const [state, dispatch] = useReducer(reducer, { cast: [], videos: [], trailerKey: null });
    const [reload] = useContext(ReloadCTX) || [];
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const getMovieData = async () => {
            if (!id) return;
            try {
                const creditsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}/credits?language=ru-RU`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                    }
                );
                const creditsData = await creditsRes.json();
                dispatch({ type: "get_credits", payload: creditsData });

                const videosRes = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}/videos?language=ru-RU`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                    }
                );

                const videosData = await videosRes.json();
                dispatch({ type: "get_videos", payload: videosData });

            } catch (error) {
                console.error(error);
            }
        };

        getMovieData();
    }, [reload, id]);

    const actorsToShow = showAll ? state.cast : state.cast.slice(0, 10);

    return (
        <div>
            <div className="grid grid-cols-5 gap-[45px]">
                {
                    actorsToShow.map((actor: any) => (
                        <div key={actor.id} className="">
                            {actor.profile_path ? (
                                <Link href={"/actor/" + actor.id}>
                                    <Image
                                        src={process.env.NEXT_PUBLIC_BASE_IMG_URL + actor.profile_path}
                                        alt="actor"
                                        width={250}
                                        height={250}
                                        draggable={false}
                                        className="w-[250px] h-[250px] object-cover rounded-[5px]"
                                    />
                                </Link>
                            ) : (
                                <Link href={"/actor/" + actor.id}>
                                    <div className="w-[250px] h-[250px] bg-gray-700 flex items-center justify-center rounded-[5px] text-white">
                                        Нет фото
                                    </div>
                                </Link>
                            )}

                            <h3 className="font-[700] text-[18px]">{actor.name}</h3>
                            <p className="font-[400] text-[16px] text-[rgba(242,246,15,1)]">{actor.character}</p>
                        </div>
                    ))
                }
            </div>
            <div className="col-span-4 flex justify-center mt-[50px] mb-[54px]">
                <Button
                    onClick={() => setShowAll(!showAll)}
                    className="bg-[] border-[2px] border-[white] hover:bg-[] max-w-[190px] w-full h-[70px] cursor-pointer font-[700] text-[17px]"
                >
                    Все актёры
                </Button>
            </div>
            <div className="h-full">
                <h3 className="text-[40px] font-[900] text-white mb-[70px]">Трейлеры фильма</h3>
                {state.trailerKey && (
                    <div className="mb-[50px]">
                        <iframe
                            src={`https://www.youtube.com/embed/${state.trailerKey}`}
                            title="Movie Trailer"
                            className="w-full min-h-[700px] h-[80vh] rounded-[15px]"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieActors;