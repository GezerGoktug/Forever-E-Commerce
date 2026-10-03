import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "@forever/storage-kit";

export type ThemeType = "light" | "dark";

type ThemeContextType = {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
};

const getSystemTheme = (): ThemeType =>
    window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";

const getInitialTheme = () => getLocalStorage<ThemeType>("theme", getSystemTheme());

const applyThemeToDOM = (theme: ThemeType) => {
    const body = document.getElementsByTagName("body");

    if (theme === "dark") body[0].classList.add("dark");
    else body[0].classList.remove("dark");
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider.");
    }
    return context;
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

    const changeTheme = (theme: ThemeType) => setTheme(theme);

    useEffect(() => {
        applyThemeToDOM(theme);
        setLocalStorage<ThemeType>("theme", theme, 1000 * 60 * 60 * 24 * 30);
    }, [theme])
    return <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, useTheme };
