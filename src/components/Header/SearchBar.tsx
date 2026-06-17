import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFilms } from "../../api";
import type { Film } from "../../types";

interface Props {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
}

export default function SearchBar({ isOpen, onOpen, onClose}: Props) {
    const [query, setQuery] = useState("")
    const [films, setFilms] = useState<Film[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    useEffect(() => {
        if (!isOpen) return
        inputRef.current?.focus
        getFilms().then(data => {
            setFilms(data.filter(film => film.card?.path))
    })

}, [isOpen])

    const q = query.trim().toLowerCase()
    const results = q 
        ? films.filter(f => f.title?.toLowerCase().includes(q)) : []

    const openFilm = (film: Film) => {
        navigate(`/watch?id=${film.id}`)
        handleClose()
    }

    const handleClose = () => {
        setQuery("")
        onClose()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && results.length > 0) openFilm(results[0])
        if (e.key === "Escape") handleClose()
    }

    if (!isOpen) { //Лупа
        return (
            <button
                onClick={onOpen}
                aria-label="Поиск"
                className="text-gray-300 transition-colors hover:text-white">
                <svg width="30" height="30" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M13.6667 8.74984C13.6667 11.4652 11.4654 13.6665 8.75002 13.6665C6.03462 13.6665 3.83335 11.4652 3.83335 8.74984C3.83335 6.03444 6.03462 3.83317 8.75002 3.83317C11.4654 3.83317 13.6667 6.03444 13.6667 8.74984ZM12.7965 14.5643C11.6494 15.3641 10.2545 15.8332 8.75002 15.8332C4.838 15.8332 1.66669 12.6619 1.66669 8.74984C1.66669 4.83782 4.838 1.6665 8.75002 1.6665C12.662 1.6665 15.8334 4.83782 15.8334 8.74984C15.8334 10.2544 15.3643 11.6494 14.5643 12.7966L17.9672 16.1994L16.1994 17.9672L12.7965 14.5643Z"></path></svg>
            </button>
        )
    }

    return (
        <div className="relative">
            <div className="flex">
                <input 
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Поиск фильмов и сериалов"
                    className="rounded-lg flex-1 p-2 border-2 border-accent bg-inputColor text-white placeholder:textColor outline-none"
                />
                <button
                    onClick={handleClose}
                    aria-label="Закрыть поиск"
                    className="text-gray-300 transition-colors hover:text-white p-2">
                    <svg width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.303 8 1.15 2.85l1.697-1.698L8 6.304l5.151-5.152 1.697 1.697-5.151 5.152 5.151 5.151-1.697 1.697L8 9.698l-5.152 5.151-1.697-1.697 5.152-5.151Z" fill="#fff"/></svg>
                </button>
            </div>
            { results.length > 0 &&(
                <ul className="absolute bg-inputColor left-0 right-0 mt-2 max-h-96 rounded-lg overflow-auto">
                    {results.map(film => (
                        <li key={film.id}>
                            <button
                                onClick={() => openFilm(film)}
                                className="flex w-full items-center p-2 gap-3 text-left transition-colors hover:bg-cardColor/50">
                                <img src={film.card?.path ?? ''} alt="" className="h-17 w-auto shrink-0 rounded object-cover"/>
                                <div className="min-w-0">
                                    <p className="truncate text-title">{film.title}</p>
                                    <p className="truncate text-textColor">{film.description}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}