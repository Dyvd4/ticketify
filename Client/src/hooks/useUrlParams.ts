import { useEffect, useState } from "react"

type UseUrlParamsOptions = {
    /** JSON parse the urlParam */
    jsonParse?: boolean,
    dontSetUrl?: boolean
}

/** @param fallBackValue 
 * when no url param with the given name could be found, use this value
*/
// note: rename to singular
export const useUrlParams = (name, fallBackValue?, options?: UseUrlParamsOptions) => {
    const [urlParamsState, setUrlParamsState] = useState<any>(null);
    useEffect(() => {
        let urlParam = new URLSearchParams(window.location.search).get(name);
        if (urlParam && !!options?.jsonParse) urlParam = JSON.parse(urlParam);
        setUrlParamsState(urlParam || fallBackValue);
    }, [])
    const setUrlParams = (params) => {
        if (!options?.dontSetUrl) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set(name, JSON.stringify(params));
            window.history.pushState(null, "", newUrl);
        }
        setUrlParamsState(params);
    }
    return [urlParamsState, setUrlParams];
}