import { Heading, IconButton, Input, Tooltip } from "@chakra-ui/react";
import { faAdd, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useAtom } from "jotai";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import searchItemAtom from "src/components/List/context/atoms/searchItemAtom";
import { sortDrawerAtom } from "src/context/atoms";

type _TableListHeaderProps = {
	title?: string;
	count: number;
	showCount?: boolean;
	useSort: boolean;
	useFilter: boolean;
	useSearch: boolean;
	onAdd?(...args: any[]): void;
};

export type TableListHeaderProps = PropsWithChildren<_TableListHeaderProps> &
	Omit<ComponentPropsWithRef<"div">, keyof _TableListHeaderProps>;

function TableListHeader(props: TableListHeaderProps) {
	const {
		title,
		count,
		showCount,
		useFilter,
		useSearch,
		useSort,
		className,
		onAdd,
		...restProps
	} = props;

	const [, setSortDrawer] = useAtom(sortDrawerAtom);
	const [searchItem, setSearchItem] = useAtom(searchItemAtom);

	return (
		<>
			<div
				className={classNames({
					"col-span-9 2xl:col-span-10": useFilter,
					"col-span-12": !useFilter,
				})}
			>
				<div className={`${className} my-4 flex justify-between`} {...restProps}>
					<Heading>
						<div className="flex items-center justify-center gap-2 whitespace-nowrap text-2xl">
							{showCount && (
								<>
									<div>({count})</div>
								</>
							)}
							{title && (
								<>
									<div>{title}</div>
								</>
							)}
							{!!useSearch && (
								<>
									<Input
										className="rounded-md"
										size={"sm"}
										placeholder={searchItem!.label}
										onChange={(e) =>
											setSearchItem({ ...searchItem!, value: e.target.value })
										}
										value={searchItem!.value}
										type={"search"}
									/>
								</>
							)}
						</div>
					</Heading>
					<div className="flex items-center gap-4">
						{!!useSort && (
							<>
								<Tooltip label="sort" placement="top" aria-label="sort">
									<span className="flex items-center justify-center">
										<IconButton
											data-testid="ListHeader-sort-button"
											size={"sm"}
											onClick={() => setSortDrawer(true)}
											aria-label="sort"
											icon={<FontAwesomeIcon icon={faSort} />}
										/>
									</span>
								</Tooltip>
							</>
						)}
						{!!onAdd && (
							<>
								<Tooltip label="add" placement="top" aria-label="add">
									<span className="flex items-center justify-center">
										<IconButton
											colorScheme={"cyan"}
											size={"sm"}
											onClick={onAdd}
											aria-label="add"
											icon={<FontAwesomeIcon icon={faAdd} />}
										/>
									</span>
								</Tooltip>
							</>
						)}
					</div>
				</div>
			</div>
			{useFilter && (
				<>
					<Heading className="col-span-3 ml-6 self-center py-2 text-xl 2xl:col-span-2">
						Filter
					</Heading>
				</>
			)}
		</>
	);
}

export default TableListHeader;
