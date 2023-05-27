import { useAtom } from "jotai";
import { useEffect } from "react";
import { TSearchItem } from "src/components/List";
import searchItemAtom from "../atoms/searchItemAtom";

const useSearchItemInit = (searchItem?: TSearchItem) => {
    const [, setSearchItem] = useAtom(searchItemAtom);

    useEffect(() => {
        if (searchItem) setSearchItem(searchItem);
    }, []);
};

export default useSearchItemInit;
