import { Box, Flex, Tag } from "@chakra-ui/react";
import { faAddressBook } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import ActionBox, { ActionBoxProps } from "src/components/ActionBox";
import useToggle from "src/hooks/useToggle";
import { cn } from "src/utils/component";
import SetResponsibleUserButton from "../SetResponsibleUserButton";
import SetStatusButton from "../SetStatusButton";

type _TicketContactDetailsActionBoxProps = {};

export type TicketContactDetailsActionBoxProps = _TicketContactDetailsActionBoxProps &
	Omit<ActionBoxProps, keyof _TicketContactDetailsActionBoxProps>;

function TicketContactDetailsActionBox({
	className,
	...props
}: TicketContactDetailsActionBoxProps) {
	const [isCollapsed, , toggleIsCollapsed] = useToggle(false);
	return (
		<ActionBox
			useDivider
			useCollapse
			isCollapsed={isCollapsed}
			toggleIsCollapsed={toggleIsCollapsed}
			className={cn("", className)}
			title={
				<>
					<span className="mr-2">Contact details</span>
					<FontAwesomeIcon icon={faAddressBook} />
				</>
			}
		>
			<Box className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="text-secondary text-sm">E-Mail</div>
					<div>dummy@example.com</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="text-secondary text-sm">Telephone</div>
					<div>578437948953</div>
				</div>
				<div className="flex items-center justify-between">
					<div className="text-secondary text-sm">username</div>
					<div>some fish</div>
				</div>
			</Box>
		</ActionBox>
	);
}

export default TicketContactDetailsActionBox;
