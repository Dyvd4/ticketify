import { atom } from "jotai";
import { TSearchItem } from "src/components/List";

const searchItemAtom = atom<TSearchItem | null>(null);
export default searchItemAtom;