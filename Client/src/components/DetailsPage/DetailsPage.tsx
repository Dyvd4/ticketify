import { TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { cloneElement, ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _DetailsPageProps = {
	leftSection: React.ReactElement;
	rightSection: {
		tabList: React.ReactElement[];
		tabPanels: React.ReactElement[];
	};
};

export type DetailsPageProps = _DetailsPageProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _DetailsPageProps>;

function DetailsPage({
	className,
	leftSection: leftPage,
	rightSection: { tabList, tabPanels },
	...props
}: DetailsPageProps) {
	return (
		<div className={cn("grid h-screen w-full grid-cols-3", className)} {...props}>
			<div className="pl-4 pt-4 pr-4">{leftPage}</div>
			<div className="col-span-2 pl-4 pt-4">
				<Tabs isFitted className="" position="relative" variant="line">
					<TabList>
						{tabList.map((li, idx) => cloneElement(li, { ...li.props, key: idx }))}
					</TabList>
					<TabPanels>
						{tabPanels.map((panel, idx) =>
							cloneElement(panel, { ...panel.props, key: idx })
						)}
					</TabPanels>
				</Tabs>
			</div>
		</div>
	);
}

export default DetailsPage;
