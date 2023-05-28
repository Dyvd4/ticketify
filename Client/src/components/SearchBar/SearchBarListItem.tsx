import { Box, Heading, Highlight, Link } from "@chakra-ui/react";
import { faArrowTurnDown, faTicket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentPropsWithRef, PropsWithChildren } from "react";

const COLOR_MAP = {
	_light: {
		backgroundColor: "gray.200",
	},
	backgroundColor: "gray.600",
	_hover: {
		_light: {
			backgroundColor: "blue.400",
		},
		backgroundColor: "blue.500",
	},
};

type _SearchBarListItemProps = {
	title: string;
	description: string;
	href: string;
	highlightQuery: string;
	enableHoverColors?: boolean;
	isActive?: boolean;
};

export type SearchBarListItemProps = PropsWithChildren<_SearchBarListItemProps> &
	Omit<ComponentPropsWithRef<"a">, keyof _SearchBarListItemProps>;

function SearchBarListItem(props: SearchBarListItemProps) {
	const {
		className,
		title,
		description,
		href,
		enableHoverColors,
		isActive,
		highlightQuery,
		...rest
	} = props;

	const hoverBackgroundColorProps = enableHoverColors ? { _hover: { ...COLOR_MAP._hover } } : {};

	const backgroundColorProps = {
		_light: {
			backgroundColor: isActive
				? COLOR_MAP._hover._light.backgroundColor
				: COLOR_MAP._light.backgroundColor,
		},
		backgroundColor: isActive ? COLOR_MAP._hover.backgroundColor : COLOR_MAP.backgroundColor,
	};

	return (
		<Link
			href={href}
			className={`${className} flex items-center gap-4 rounded-md 
                        p-4 hover:no-underline`}
			{...backgroundColorProps}
			{...hoverBackgroundColorProps}
			{...rest}
		>
			<FontAwesomeIcon className="text-secondary" icon={faTicket} size={"1x"} />
			<Box className="flex w-full min-w-0 items-center justify-between">
				<Box className="flex min-w-0 flex-col truncate">
					<Box className="text-secondary text-xs">{description}</Box>
					<Heading as="h2" className="m-0 text-lg leading-tight">
						<Highlight
							styles={{
								backgroundColor: "orange.300",
							}}
							query={highlightQuery}
						>
							{title}
						</Highlight>
					</Heading>
				</Box>
				<FontAwesomeIcon
					className="text-secondary rotate-90"
					icon={faArrowTurnDown}
					size={"1x"}
				/>
			</Box>
		</Link>
	);
}

export default SearchBarListItem;
