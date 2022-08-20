import { useEffect, useState } from "react"

export const useUrlParams = (name, parse?: boolean, fallBackValue?) => {
    const [urlParams, setUrlParams] = useState<any>(null);
    useEffect(() => {
        let urlParam = new URLSearchParams(window.location.search).get(name);
        if (urlParam && parse) urlParam = JSON.parse(urlParam);
        setUrlParams(urlParam || fallBackValue);
    }, [])
    return [urlParams, setUrlParams];
}