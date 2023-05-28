import { useEffect, useState } from "react";

const useLocalStorage = (key: string, defaultValue?: any) => {
	const getDefaultValue = () => {
		return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)!) : defaultValue;
	};

	const [value, setValue] = useState(getDefaultValue());

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value]);

	return [value, setValue] as const;
};

export default useLocalStorage;
