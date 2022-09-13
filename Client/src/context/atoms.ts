import { atom } from "jotai";
import { mostLikedCommentSortParam } from "src/pages/Ticket/Details/sections/CommentsSection";

export const sidebarAtom = atom(false);

export const sortDrawerAtom = atom(false);
export const filterDrawerAtom = atom(false);

export const commentSortParamAtom = atom(mostLikedCommentSortParam);

export const hackyCommentRefreshAtom = atom(0);