export default function ProfileButton() {
    const handleClick = () => {
        
    }
    return (
        <button
        onClick={handleClick}
        aria-label="Профиль"
        className="text-gray-300 transition-colors hover:text-title">
            Войти
        </button>
    )
}