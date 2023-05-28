import * as React from "react";
import BgBox from "./BgBox";

interface CardProps {
	children: React.ReactNode;
	centered?: boolean;
	className?: string;
	style?: any;
}

function Card(props: CardProps) {
	let styles = {
		width: "fit-content",
		height: "fit-content",
		...props.style,
	};
	return (
		<BgBox
			style={styles}
			className={`rounded-lg border border-black p-8 shadow-md
                    ${
						props.centered
							? `absolute top-1/2 left-1/2 
                    -translate-x-1/2 -translate-y-1/2 transform`
							: ""
					} 
                    ${props.className}`}
		>
			{props.children}
		</BgBox>
	);
}

export default Card;
