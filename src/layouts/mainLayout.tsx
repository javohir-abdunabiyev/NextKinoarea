import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import "./mainLayout.css"
import Link from "next/link";

interface layoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<layoutProps> = ({ children }) => {
    return (
        <>
            <div className="container">
                <div>
                    <div className="flex justify-between items-center h-[80px] mb-[50px]">
                        <Link href={"/"}>
                            <Image src="/images/logo.png" alt="logo" width={130} height={30} />
                        </Link>
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

                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}

export default MainLayout;