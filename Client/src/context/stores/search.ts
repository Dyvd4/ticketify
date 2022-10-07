import { atom } from "jotai";
import { TSearchItem } from "src/components/List";

export const searchItemAtom = atom<TSearchItem | null>(null);