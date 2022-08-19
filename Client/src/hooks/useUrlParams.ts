import { useEffect, useState } from "react"

export const useUrlParams = (name, parse?: boolean, defaultValue?) => {
    const [urlParams, setUrlParams] = useState<any>(defaultValue);
    useEffect(() => {
        let urlParam = new URLSearchParams(window.location.search).get(name);
        if (urlParam && parse) urlParam = JSON.parse(urlParam);
        setUrlParams(urlParam || defaultValue);
    }, [])
    return [urlParams, setUrlParams];
}