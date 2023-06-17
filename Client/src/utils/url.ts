const API_URL = import.meta.env.VITE_API_URL;

export const getUrlParam = (name: string) => {
	const url = new URL(window.location.href);
	const urlParam = url.searchParams.get(name);
	return urlParam ? JSON.parse(urlParam) : null;
};

export const setUrlParam = (name: string, param) => {
	const newUrl = new URL(window.location.href);
	newUrl.searchParams.set(name, JSON.stringify(param));
	window.history.pushState(null, "", newUrl);
};

export const deleteUrlParam = (name: string) => {
	const newUrl = new URL(window.location.href);
	newUrl.searchParams.delete(name);
	window.history.pushState(null, "", newUrl);
};

export const getApiUrl = () => API_URL;
