import { useEffect, useState } from "react";
import type { Film } from "../../types";
import { getFilms } from "../../api";
import FilmCard from "../../components/FilmCard/FilmCard";

// убрат
//  ||
//  \/
import Logo from "../../components/Header/Logo";
import Nav from "../../components/Header/Nav";
import SearchBar from "../../components/Header/SearchBar";
import ProfileButton from "../../components/Header/ProfileButton";



export default function Home() {
    const [films, setFilms] = useState<Film[]>([])
    const [selectedFilm, setSelectedFilm] = useState<Film | null>(null)

    useEffect(() => { getFilms().then(data => {
        setFilms(data.filter(film => film.card?.path))
    }) }, [])

    const [searchBar, setSearchBar] = useState(false)
    
    const handleCardClick = (film: Film) => {
        if (selectedFilm?.id === film.id) {
            setSelectedFilm(null)
        } else {
            setSelectedFilm(film)
        }
    }

    return (
        <div className=" bg-black min-h-screen text-white p-8">
            <Logo />
            <Nav />
            <SearchBar 
             isOpen={searchBar}
             onOpen={() => setSearchBar(true)}
             onClose={() => setSearchBar(false)}/>
             <ProfileButton />
            <div className="grid grid-cols-4 gap-4">
                {films.map(film => (
                    <FilmCard
                        key={film.id}
                        film={film}
                        onClick={handleCardClick}
                        isSelected={selectedFilm?.id === film.id}>

                </FilmCard>))}
            </div>
        </div>
    )
}
