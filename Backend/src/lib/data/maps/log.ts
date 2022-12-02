type LogLevels = "error" | "warn" | "info"

type LogLevelMap = {
    [key in LogLevels]?: string
}

export const LogLevelIconMap: LogLevelMap = {
    "error": "circle-exclamation",
    "warn": "triangle-exclamation",
    "info": "circle-info"
}

export const LogLevelColorSchemeMap: LogLevelMap = {
    "error": "red",
    "warn": "orange.300",
}