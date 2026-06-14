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
                card: { id: null, path: cardPath, is_horizontal: isHorizontal },
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
        <div className="flex justify-center items-center min-h-screen bg-black text-white py-4">
            <div className="rounded-xl mx-auto max-w-3xl p-6 border border-gray-800 bg-gray-900/40">
                <h1 className="mb-8 text-2xl font-semibold">Добавить фильм</h1>
                <div className="flex flex-col gap-6">
                    {/* Название */}
                    <label className="flex flex-col gap-3">
                        <span className="text-sm text-gray-400">Название</span>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например: Интерстеллар"
                            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-gray-400"
                        />
                    </label>

                    {/* Описание */}
                    <label className="flex flex-col gap-2">
                        <span className="text-sm text-gray-400">Название</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="resize-none rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 outline-none focus:border-gray-400"
                        />
                    </label>

                    {/* чекбоксы */}
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={isSerial} onChange={(e) => setIsSerial(e.target.checked)}/>
                            <span className="text-sm">Сериал</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={isHorizontal} onChange={(e) => setIsHorizontal(e.target.checked)}/>
                            <span className="text-sm">Горизонтальный постер</span>
                        </label>
                    </div>
                    {/* Файлы */}
                    <div className="grid grid-cols-3 gap-3">
                        <label className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/50 px-4 py-6 text-center transition-colors hover:border-gray-500 hover:bg-gray-900">
                            <span className="text-sm font-medium text-gray-300">Постер (Изображение)</span>
                            <span className={`max-w-full truncate text-xs ${cardFile ? 'text-green-400' : 'text-gray-500'}`}>{cardFile ? cardFile.name : 'Нажми, чтобы выбрать изображеник'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setCardFile(e.target.files?.[0] ?? null)} />
                        </label>
                        <label className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/50 px-4 py-6 text-center transition-colors hover:border-gray-500 hover:bg-gray-900">
                            <span className="text-sm font-medium text-gray-300">Лого (Изображение)</span>
                            <span className={`max-w-full truncate text-xs ${logoFile ? 'text-green-400' : 'text-gray-500'}`}>{logoFile ? logoFile.name : 'Нажми, чтобы выбрать изображеник'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
                        </label>
                        <label className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/50 px-4 py-6 text-center transition-colors hover:border-gray-500 hover:bg-gray-900">
                            <span className="text-sm font-medium text-gray-300">Трейлер (Видео)</span>
                            <span className={`max-w-full truncate text-xs ${trailerFile ? 'text-green-400' : 'text-gray-500'}`}>{trailerFile ? trailerFile.name : 'Нажми, чтобы выбрать видео'}</span>
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => setTrailerFile(e.target.files?.[0] ?? null)} />
                        </label>
                    </div>

                    {/* Баннеры */}
                    {error && <div className="rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-400">{error}</div>}
                    {success && <div className="rounded-lg bg-green-500/15 px-4 py-3 text-sm text-green-400">{success}</div>}

                    {/* Кнопка */}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className=" rounded-lg bg-white px-6 py-4 font-medium text-black hover:bg-gray-200 disabled:opacity-50">
                            {loading ? 'Сохраняю...' : 'Добавить фильм'}
                    </button>

                </div>
            </div>
        </div>
    )
}