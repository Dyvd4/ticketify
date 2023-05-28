import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { sortDrawerAtom } from "src/context/atoms";

type SortDrawerProps = {
	inputs: React.ReactNode;
	onReset(...args);
	onApply(...args);
	onDrawerBodyRefChange(drawerRef: HTMLDivElement | null);
};

function SortDrawer({ inputs, ...props }: SortDrawerProps) {
	const [drawerActive, setDrawer] = useAtom(sortDrawerAtom);

	const handleOnClose = () => {
		props.onReset();
		setDrawer(false);
	};
	const handleOnApply = () => {
		props.onApply();
		setDrawer(false);
	};

	return (
		<Drawer isOpen={drawerActive} placement={"right"} onClose={() => setDrawer(false)}>
			<DrawerOverlay />
			<DrawerContent data-testid="SortDrawer">
				<DrawerCloseButton />
				<DrawerHeader>Sort</DrawerHeader>
				<DrawerBody
					ref={(drawerRef) => {
						props.onDrawerBodyRefChange(drawerRef);
					}}
				>
					{inputs}
				</DrawerBody>
				<DrawerFooter>
					<Button onClick={handleOnClose} variant="outline" mr={3}>
						reset
					</Button>
					<Button onClick={handleOnApply} colorScheme="blue" mr={3}>
						apply
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export default SortDrawer;
