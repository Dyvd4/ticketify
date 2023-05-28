import { useEffect } from "react";

type UseIntersectionObserverArgs = {
	selector: keyof HTMLElementTagNameMap | Omit<keyof HTMLElementTagNameMap, string>;
	events: {
		lastItemIntersecting?(): void;
	};
	options?: Omit<IntersectionObserverInit, "root"> & {
		root?: keyof HTMLElementTagNameMap | Omit<keyof HTMLElementTagNameMap, string>;
	};
};

const useIntersectionObserver = ({ selector, events, options }: UseIntersectionObserverArgs) => {
	const getItemsToObserve = () => document.querySelectorAll(selector as string);

	const handleObserve = (entries, observer) => {
		if (events.lastItemIntersecting) handleLastItemIntersecting(entries, observer);
	};

	useEffect(() => {
		const intersectionObserver = new IntersectionObserver(handleObserve, options as any);
		const elementsToObserve = getItemsToObserve();
		elementsToObserve.forEach((element) => {
			intersectionObserver.observe(element);
		});
		return () => {
			elementsToObserve.forEach((element) => {
				intersectionObserver.unobserve(element);
			});
			intersectionObserver.disconnect();
		};
	});

	const handleLastItemIntersecting = (
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	) => {
		const itemsToObserve = getItemsToObserve();
		const lastItemIntersecting = entries.find(
			(entry) => entry.target === itemsToObserve[itemsToObserve.length - 1]
		)?.isIntersecting;
		if (events.lastItemIntersecting && lastItemIntersecting) events.lastItemIntersecting();
	};
};

export default useIntersectionObserver;
