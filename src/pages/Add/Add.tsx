import { useState } from "react";
import { uploadFile, createFilm } from "../../api";
import type { Film } from "../../types";

export default function Add() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isSerial, setIsSerial] = useState(false)
    const [trailerFile, setTrailerFile] = useState<File | null>(null)
    const [cardFile, setCardFile] = useState<File | null>(null)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [isHorizontal, setIsHorizontal] = useState(false)
    const [error, setError] = useState<String | null>(null)
    const [success, setSuccess] = useState<String | null>(null)

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('Укажи название')
            return
        }
        if (!trailerFile || !cardFile || !logoFile) {
            setError('нужны все три файла: трейлер, карточка и лого')
            return
        }
        setLoading(true)
        try {
            // три независимых загрузки, запускаем параллельно
            const [trailerPath, cardPath, logoPath] = await Promise.all([
                uploadFile(trailerFile, 'trailer'),
                uploadFile(cardFile, 'card'),
                uploadFile(logoFile, 'logo'),
            ])

            const film: Film = {
                id: null,
                title: title.trim(),
                is_serial: isSerial,
                description: description.trim() || null,
                trailer: { id: null, path: trailerPath },
                card: { id: null, path: trailerPath, is_horizontal: isHorizontal },
                logo: { id: null, path: logoPath },
            }

            const { id } = await createFilm(film)
            setSuccess(`Фильм добавлен, id: ${id}`)
        } catch (e) {
            console.error(e)
            setError('не удалось сохранить (проверь бэк)')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className=" min-h-screen bg-black text-white">
            <div className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="mb-8 text-2xl font-semibold">Добавить фильм</h1>
                <div className="flex flex-col gap-6">
                    <label className="flex flex-col gap-6">
                        <span className="text-sm text-gray-400">Название</span>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например: Интерстеллар"
                            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-gray-400"
                            />
                    </label>
                </div>
            </div>
        </div>
    )
}