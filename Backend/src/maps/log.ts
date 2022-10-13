type LogLevels = "error" | "warn" | "info"

type LogLevelMap = {
    [key in LogLevels]?: string
}

export const LogLevelIconMap: LogLevelMap = {
    "error": "circle-exclamation",
    "warn": "triangle-exclamation",
    "info": "circle-info"
}

export const LogLevelColorMap: LogLevelMap = {
    "error": "red-500",
    "warn": "yellow-600",
}