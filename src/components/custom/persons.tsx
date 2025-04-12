import { ReloadCTX } from "@/contexts/reload";
import Image from "next/image";
import { useContext, useEffect, useReducer, useState } from "react";

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "get":
            return action.payload;
        default:
            return state;
    }
};

function Persons() {
    const [state, dispatch] = useReducer(reducer, []);
    const [reload] = useContext(ReloadCTX);

    useEffect(() => {
        const getTMDBApi = async () => {
            try {
                const res = await fetch(
                    process.env.NEXT_PUBLIC_BASE_URL + `/person/popular?language=ru-RU`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        },
                    }
                );
                const data = await res.json();
                dispatch({ type: "get", payload: data.results });
                console.log(data.results);

            } catch (error) {
                console.error(error);
            }
        };

        getTMDBApi();
    }, [reload]);

    return (
        <>
            <div>
                <h1 className="font-[900] text-[45px] text-white mb-[40px] mt-[50px]">Популярные персоны</h1>
                <div className="flex gap-[20px]">
                    <div className="flex gap-[20px] mb-[50px]">
                        <div className="relative">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${state[0]?.profile_path}`}
                                alt=""
                                width={400}
                                height={400}
                                draggable="false"
                                className="rounded-[10px] w-[400px] h-[400px] object-cover"
                            />
                            <p className="absolute top-[20px] left-[20px] text-[rgba(242,246,15,1)] font-bold">Рейтинг : {Math.round(state[0]?.popularity)}</p>
                            <div className="absolute bottom-[20px] left-[40px]">
                                <h3 className="text-[27px] font-[700]">{state[0]?.name}</h3>
                                <p className="text-[rgba(255,255,255,0.35)] text-[20px] font-[600]">{state[0]?.original_name}</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL}${state[1]?.profile_path}`}
                                alt=""
                                width={400}
                                height={400}
                                draggable="false"
                                className="rounded-[10px] w-[400px] h-[400px] object-cover"
                            />
                            <p className="absolute top-[20px] left-[20px] text-[rgba(242,246,15,1)] font-bold">Рейтинг : {Math.round(state[1]?.popularity)}</p>
                            <div className="absolute bottom-[20px] left-[40px]">
                                <h3 className="text-[27px] font-[700]">{state[1]?.name}</h3>
                                <p className="text-[rgba(255,255,255,0.35)] text-[20px] font-[600]">{state[1]?.original_name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-[30px] !pt-[20px] bg-[rgba(27,33,51,1)] max-w-[500px] w-full max-h-[400px] h-full overflow-y-scroll no-scrollbar rounded-[10px]">
                        {
                            state.map((person: any) => (
                                <div key={person.id} className="flex justify-between items-center border-b-[1px] border-b-[rgba(255,255,255,0.1)] py-[10px]">
                                    <div>
                                        <h3 className="text-[20px] font-[700]">{person.name}</h3>
                                        <p className="text-[rgba(59,72,107,1)] text-[15px] font-[600]">{person.original_name}</p>
                                    </div>
                                    <p className="text-[rgba(242,246,15,1)] font-[600] text-[15px]">Рейтинг : {Math.round(person.popularity)}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Persons;