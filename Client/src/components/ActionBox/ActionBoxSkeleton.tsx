import { Flex, MenuItem, Skeleton } from "@chakra-ui/react";
import ActionBox, { ActionBoxProps } from "src/components/ActionBox";
import { cn } from "src/utils/component";

type _ActionBoxSkeletonProps = {};

export type ActionBoxSkeletonProps = _ActionBoxSkeletonProps &
	Omit<ActionBoxProps, keyof _ActionBoxSkeletonProps>;

function ActionBoxSkeleton({ className, ...props }: ActionBoxSkeletonProps) {
	return (
		<ActionBox
			useDivider
			title="..."
			className={cn("", className)}
			menuActions={[
				<MenuItem>
					If you were able to click this menu, it probably loaded too long :D
				</MenuItem>,
			]}
		>
			<Flex gap={4} direction="column">
				<Skeleton height="20px" className="rounded-md" />
				<Skeleton height="20px" className="rounded-md" />
				<Skeleton height="20px" className="rounded-md" />
				<Skeleton height="20px" className="rounded-md" />
			</Flex>
		</ActionBox>
	);
}

export default ActionBoxSkeleton;
