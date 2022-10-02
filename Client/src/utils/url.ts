export const getUrlParam = (name: string) => {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

export const setUrlParam = (name: string, param) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(name, JSON.stringify(param));
    window.history.pushState(null, "", newUrl);
}

export const deleteUrlParam = (name: string) => {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete(name);
    window.history.pushState(null, "", newUrl);
}