import { useAtom } from "jotai";
import { useEffect } from "react";
import { BreadcrumbLink, BreadcrumbOptions, breadcrumbAtom } from "../stores/breadcrumb";

export default function useBreadcrumb(links: BreadcrumbLink[], options?: BreadcrumbOptions) {
	const [, setBreadcrumb] = useAtom(breadcrumbAtom);

	useEffect(() => {
		setBreadcrumb({
			...options,
			links,
		});
	}, []);
}
