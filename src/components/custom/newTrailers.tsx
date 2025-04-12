import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./noscrollbar.css"
import { FaPlay } from "react-icons/fa";

type NewTrailersProps = {
    movies: any[];
};

function NewTrailers({ movies }: NewTrailersProps) {
    const [trailers, setTrailers] = useState<{ [key: number]: string }>({});
    const [selectedMovie, setSelectedMovie] = useState<any>(null)
    const [activeMovie, setActiveMovie] = useState(null)

    useEffect(() => {
        const selectedMovieId = localStorage.getItem("movieId")
        setSelectedMovie(selectedMovieId || movies[0]?.id)
    }, [movies])

    useEffect(() => {
        const fetchTrailers = async () => {
            const newTrailers: { [key: number]: string } = {};

            const requests = movies.map(async (movie: any) => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${movie.id}/videos`,
                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                            },
                        }
                    );
                    const data = await res.json();

                    const trailer = data.results.find(
                        (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
                    );
                    if (trailer) {
                        newTrailers[movie.id] = trailer.key;
                    }
                } catch (error) {
                    console.error("Ошибка при получении трейлера:", error);
                }
            });

            await Promise.all(requests);
            setTrailers(newTrailers);
        };

        if (movies.length) {
            fetchTrailers();
        }
    }, [movies]);

    const handleMovieClick = (movieId: any) => {
        setSelectedMovie(movieId);
        setActiveMovie(movieId);
        localStorage.setItem("movieId", movieId.toString());
    };

    const selectedTrailerKey = trailers[selectedMovie];
    const selectedMovieData = movies.find((movie) => movie.id === selectedMovie);

    return (
        <div className="">
            <div className="flex !w-full justify-between items-center mb-[20px]">
                <h1 className="text-[40px] font-[900] text-white">Новые трейлеры</h1>
                <Link href="#" className="font-[700] text-[18px] text-white">
                    Все трейлеры
                </Link>
            </div>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${selectedTrailerKey}`}
                title=""
                className="w-full h-[650px] rounded-[15px] mb-[20px]"
            ></iframe>
            <p className="font-[900] text-[35px] mb-[50px]">{selectedMovieData?.title}</p>
            <div className="flex w-full overflow-x-auto gap-[12px] no-scrollbar mb-[40px]">
                {movies.map((movie: any, index: number) => (
                    <div
                        key={movie.id}
                        className="fade-in min-w-[300px] h-[200px]"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <Image
                            src={process.env.NEXT_PUBLIC_BASE_IMG_URL + movie.poster_path}
                            alt="movie"
                            fill
                            draggable="false"
                            className="relative rounded-[12px] object-cover w-full h-auto hover:shadow-[0px_0px_15px_0px_rgba(72,113,255,0.8)] hover:ease-in hover:transition-all duration-100"
                        />
                        <div
                            className={`absolute w-full h-full rounded-[12px] flex justify-center items-center cursor-pointer hover:shadow-[0px_0px_15px_0px_rgba(72,113,255,0.8)] hover:ease-in hover:transition-all duration-100
                                ${activeMovie === movie.id ? "bg-[rgba(54,87,203,0.58)]" : "bg-[rgba(0,0,0,0)]"}
                                `}
                            onClick={() => handleMovieClick(movie.id)}
                        >
                            <FaPlay size={40} className="" />
                        </div>
                    </div>
                ))}
            </div>

        </div >
    );
}

export default NewTrailers;
