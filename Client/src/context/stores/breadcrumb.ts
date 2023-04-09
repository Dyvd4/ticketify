import { BreadcrumbLinkProps, Theme } from "@chakra-ui/react";
import { atom } from "jotai";

export type Breadcrumb = {
    links: BreadcrumbLink[]
    containerSize?: Exclude<keyof Theme["sizes"]["container"], "xl">
}

export type BreadcrumbOptions = Omit<Breadcrumb, "links">

export type BreadcrumbLink = {
    name: string,
} & Pick<BreadcrumbLinkProps, "href" | "isCurrentPage">

export const breadcrumbAtom = atom({
    links: [] as BreadcrumbLink[]
} as Breadcrumb);