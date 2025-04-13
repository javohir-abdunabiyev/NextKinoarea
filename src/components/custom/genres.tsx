import { ReloadCTX } from "@/contexts/reload";
import { useContext, useEffect, useReducer } from "react";
import "./noscrollbar.css"

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "get":
            return action.payload || [];
        default:
            return state;
    }
};

function Genres() {
    const [state, dispatch] = useReducer(reducer, [])
    const [reload] = useContext(ReloadCTX)
    useEffect(() => {
        const getTMDBApi = async () => {
            try {
                const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/genre/movie/list?language=ru-RU", {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
                    }
                })

                const data = await res.json()
                console.log(data.genres)
                dispatch({ type: "get", payload: data.genres });
            } catch (error) {
                console.error(error)
            }
        };
        getTMDBApi()
    }, [reload])

    return (
        <>
            <div className="flex items-center max-w-[560px] w-full overflow-x-auto no-scrollbar gap-[30px]">
                <p className="cursor-pointer">Все</p>
                {state.map((genre: any) => {
                    return (
                        <div key={genre.id}>
                            <p className="cursor-pointer">{genre.name}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Genres;