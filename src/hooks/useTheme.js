import React, { createContext, useState, useContext } from 'react'
import { Colors, Spacing, fontSizes, formTitle, formSurface, formSurfaceContainer, formContainer, formSubtitle } from '@constants/Theme'

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState({
        colors: Colors.light,
        spacing: Spacing,
        fontSizes: fontSizes,
        formTitle: formTitle,
        formSubtitle: formSubtitle,
        formSurface: formSurface,
        formSurfaceContainer: formSurfaceContainer,
        formContainer: formContainer,
    });
        
    const toggleTheme = () => {
        setTheme((prev) => (prev.colors === Colors.light ? Colors.dark : Colors.light))
    };


    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => useContext(ThemeContext);