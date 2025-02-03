type ThemeColors = "Zinc" | "Slate" | "Neutral" | "Gray" | "Stone" | "Red" | "Rose" | "Orange" | "Green" | "Blue" | "Yellow" | "Violet"
interface ThemeColorStateParams {
    themeColor : ThemeColors
    setThemeColor : React.Dispatch<React.SetStateAction<ThemeColors>>
}