import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFilms } from "../../api";
import type { Film } from "../../types";
import searchIcon from "../../assets/search.svg"

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
                <img src={searchIcon} alt="" className="h-5 w-5"/>
            </button>
        )
    }
}