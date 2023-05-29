import { Link, LinkProps } from "@chakra-ui/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "src/utils/component";

type IconLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
	LinkProps & {
		children?: React.ReactNode;
		disabled?: boolean;
		/**
		 * @param normal
		 * text and icon is black in light mode and white in dark mode
		 * @param black
		 * text and icon is always black (also in dark mode)
		 */
		variant?: "normal" | "black";
	} & React.RefAttributes<HTMLAnchorElement>;

function IconLink({ children, className, disabled, variant = "normal", ...props }: IconLinkProps) {
	const variantLinkClassNames =
		variant === "normal" ? "text-black dark:text-white" : "text-black";

	const variantIconClassNames =
		variant === "normal" ? "fill-black dark:fill-white" : "fill-black";

	return (
		<Link
			className={cn(`group flex  items-center hover:underline ${variantLinkClassNames}
						${disabled ? "pointer-events-none" : ""}
						${className}`)}
			{...props}
		>
			{children}&nbsp;
			<FontAwesomeIcon
				size="sm"
				icon={faArrowRight}
				className={`inline transition-transform 
										group-hover:translate-x-1 ${variantIconClassNames}`}
			/>
		</Link>
	);
}

export default IconLink;
