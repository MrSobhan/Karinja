import { useEffect, useState } from "react"
import { FiSun, FiMoon } from "react-icons/fi"
import { Button } from "@/components/ui/button"

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme")
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark")
            setDarkMode(true)
        }
    }, [])

    const toggleTheme = () => {
        const isDark = !darkMode
        setDarkMode(isDark)
        if (isDark) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }

    return (
        <Button
            onClick={toggleTheme}
            variant="outline"
            className="rounded-full w-10 h-10 shadow-md"
        >
            {darkMode ? (
                <FiSun className="text-gray-100" />
            ) : (
                <FiMoon className="text-gray-900" />
            )}
        </Button>
    )
}

export default ThemeToggle
