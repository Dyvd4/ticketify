import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { mostLikedCommentSortParam } from "src/pages/Ticket/Details/sections/CommentsSection";

export const sidebarIsCollapsedAtom = atomWithStorage("sidebarIsCollapsed", false);

export const sortDrawerAtom = atom(false);
export const filterDrawerAtom = atom(false);

export const commentSortParamAtom = atom(mostLikedCommentSortParam);

export const hackyCommentRefreshAtom = atom(0);

export const portalIsRenderedAtom = atom(false);
export const pagePortalIsRenderedAtom = atom(false);

export const isLoadingAtom = atom(false);
