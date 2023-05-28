import { Button } from "@chakra-ui/react";
import { faChevronLeft, faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberButton from "./NumberButton";

export type PagerProps = {
	currentPage: number;
	pagesCount: number;
	onChange?(page: number);
	centered?: boolean;
} & Omit<React.ComponentPropsWithRef<"div">, "onChange">;

function Pager({ currentPage, pagesCount, onChange, centered, ...props }: PagerProps) {
	const isLargePager = pagesCount > 7;
	const hitsFive = isLargePager && currentPage >= 5;

	const penUltimatePage = pagesCount - 2;
	const secondLastPage = pagesCount - 1;
	const hitsPenultimate = isLargePager && currentPage >= penUltimatePage;

	const pageNumbers = hitsFive
		? hitsPenultimate
			? [1, 2, penUltimatePage - 2, penUltimatePage - 1, penUltimatePage]
			: [1, 2, currentPage - 1, currentPage, currentPage + 1]
		: new Array(pagesCount)
				.fill(undefined)
				.slice(0, isLargePager ? 5 : pagesCount)
				.map((item, index) => index + 1);

	const handlePageChange = (newPageNumber: number) => {
		if (
			!onChange ||
			newPageNumber > pagesCount ||
			newPageNumber < 1 ||
			newPageNumber === currentPage
		)
			return;
		onChange(newPageNumber);
	};

	return (
		<div
			data-testid="Pager"
			className={`flex gap-2 ${centered ? "justify-center" : ""}`}
			{...props}
		>
			<Button
				size={"sm"}
				data-testid="prev-button"
				onClick={() => handlePageChange(currentPage - 1)}
			>
				<FontAwesomeIcon icon={faChevronLeft} />
			</Button>
			{pageNumbers.map((pageNumber) =>
				hitsFive && pageNumber === 2 ? (
					<Button size={"sm"} key={pageNumber} disabled>
						<FontAwesomeIcon icon={faEllipsis} />
					</Button>
				) : (
					<NumberButton
						size={"sm"}
						key={pageNumber}
						active={currentPage === pageNumber}
						onClick={() => handlePageChange(pageNumber)}
					>
						{pageNumber}
					</NumberButton>
				)
			)}
			{isLargePager && (
				<>
					{hitsPenultimate ? (
						<NumberButton
							size={"sm"}
							active={currentPage === secondLastPage}
							onClick={() => handlePageChange(secondLastPage)}
						>
							{secondLastPage}
						</NumberButton>
					) : (
						<Button size={"sm"} disabled>
							<FontAwesomeIcon icon={faEllipsis} />
						</Button>
					)}
					<NumberButton
						size={"sm"}
						active={currentPage === pagesCount}
						onClick={() => handlePageChange(pagesCount)}
					>
						{pagesCount}
					</NumberButton>
				</>
			)}
			<Button
				size={"sm"}
				data-testid="next-button"
				onClick={() => handlePageChange(currentPage + 1)}
			>
				<FontAwesomeIcon icon={faChevronRight} />
			</Button>
		</div>
	);
}

export default Pager;
