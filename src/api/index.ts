import axios from "axios";
import type { Film, Release } from "../types";

const api = axios.create({
    baseURL: ''
})

export const getFilms = async (): Promise<Film[]> => {
    const response = await api.get('/api/films')
    return response.data ?? []
}

export const getRelease = async (
    filmId: number,
    season: number,
    seria: number
): Promise<Release> => {
    const response = await api.get('api/releases', {
        params: {
            Id: filmId, // ?film=1
            season: season, //&season=1
            seria: seria // &seria=3
        }
    })
    return response.data
}