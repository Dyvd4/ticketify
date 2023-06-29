import { TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { cloneElement, ComponentPropsWithRef, PropsWithChildren } from "react";
import { cn } from "src/utils/component";

type _DetailsPageProps = {
	head: React.ReactElement;
	body: {
		tabList: React.ReactElement[];
		tabPanels: React.ReactElement[];
	};
};

export type DetailsPageProps = _DetailsPageProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _DetailsPageProps>;

function DetailsPage({
	className,
	head,
	body: { tabList, tabPanels },
	...props
}: DetailsPageProps) {
	return (
		<div className={cn("mt-8 flex flex-col gap-8", className)} {...props}>
			<div>{head}</div>
			<div>
				<Tabs isFitted position="relative" variant="line">
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
