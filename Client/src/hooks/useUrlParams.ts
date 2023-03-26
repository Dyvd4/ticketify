import qs from "qs"
import { useEffect, useState } from "react"

type UseUrlParamsOptions = {
    dontSetUrl?: boolean
}

/** @param fallBackValue 
 * when no url param with the given name could be found, use this value
*/
// note: rename to singular
export const useUrlParams = (name: string, fallBackValue?, options?: UseUrlParamsOptions) => {
    const [urlParamsState, setUrlParamsState] = useState<any>(fallBackValue);

    useEffect(() => {
        let urlParam = qs.parse(window.location.search, { ignoreQueryPrefix: true })[name];
        setUrlParams(urlParam || fallBackValue)
    }, [])

    const setUrlParams = (params) => {
        if (!options?.dontSetUrl) {
            const newUrl = new URL(window.location.href);
            const isPrimitive = typeof params !== "object"; // qs.stringify only stringifies objects, now primitives
            newUrl.searchParams.set(name, isPrimitive ? params : qs.stringify(params));
            window.history.pushState(null, "", newUrl);
        }
        setUrlParamsState(params);
    }

    return [urlParamsState, setUrlParams];
}