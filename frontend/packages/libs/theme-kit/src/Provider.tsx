import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "@forever/storage-kit";

export type ThemeType = "light" | "dark";

type Store = {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
};
const systemTheme: ThemeType = window.matchMedia("(prefers-color-scheme:dark)")
    .matches
    ? "dark"
    : "light";

const getInitialTheme = () => getLocalStorage<ThemeType>("theme", systemTheme || "light");

const applyThemeToDOM = (theme: ThemeType) => {
    const body = document.getElementsByTagName("body");

    if (theme === "dark") body[0].classList.add("dark");
    else body[0].classList.remove("dark");
};

const initialState: Store = {
    theme: getInitialTheme(),
    setTheme: () => { }
}

const ThemeContext = createContext<Store>(initialState);

const useThemeStore = () => useContext(ThemeContext);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>(initialState.theme);

    const changeTheme = (theme: ThemeType) => setTheme(theme);

    useEffect(() => {
        applyThemeToDOM(theme);
        setLocalStorage<ThemeType>("theme", theme, 1000 * 60 * 60 * 24 * 30);
    }, [theme])
    return <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, ThemeContext, useThemeStore };
