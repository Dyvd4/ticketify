import { Table, TableContainer, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import autoAnimate from "@formkit/auto-animate";
import classNames from "classnames";
import { ComponentPropsWithRef, PropsWithChildren } from "react";
import { UseQueryResult } from "react-query";
import ErrorAlert from "../../ErrorAlert";
import ListFilter from "../ListFilter";
import ListResultItems from "../Result/ListResultItems";
import { PagerResult } from "../Result/PagerResultItems";
import SortColumns from "../Sort/SortColumns";
import { TSortItem } from "../Sort/SortItems";
import TableListItemSkeleton from "./TableListItemSkeleton";
type _TableListBodyProps = {
	useFilter: boolean;
	filterProps: {
		onFilterApply(...args: any[]): void;
		onFilterReset(...args: any[]): void;
	};
	listProps: {
		columns: TSortItem[];
		query: UseQueryResult<PagerResult, unknown>;
		listItemRender(listItem): React.ReactElement;
	};
};

export type TableListBodyProps = _TableListBodyProps &
	Omit<PropsWithChildren<ComponentPropsWithRef<"div">>, keyof _TableListBodyProps>;

function TableListBody({ className, useFilter, ...props }: TableListBodyProps) {
	const { listProps, filterProps } = props;

	return (
		<>
			<div
				className={classNames({
					"col-span-9 2xl:col-span-10": useFilter,
					"col-span-12": !useFilter,
				})}
			>
				<TableContainer className="rounded-md border">
					<Table variant="simple">
						<Thead>
							<Tr>
								<SortColumns columns={listProps.columns} />
							</Tr>
						</Thead>
						<Tbody ref={(listRef) => listRef && autoAnimate(listRef)}>
							{listProps.query.isLoading && (
								<>
									{new Array(8).fill(null).map((e, i) => (
										<TableListItemSkeleton
											key={i}
											columnCount={listProps.columns.length}
										/>
									))}
								</>
							)}
							{listProps.query.isError && (
								<>
									<ErrorAlert />
								</>
							)}
							{!listProps.query.isLoading && !listProps.query.isError && (
								<>
									<ListResultItems
										as={"tr"}
										variant={"pagination"}
										emptyDisplay={
											<>
												<Tr>
													<Td colSpan={listProps.columns.length}>
														This list seems to be empty 😴
													</Td>
												</Tr>
											</>
										}
										data={listProps.query.data}
									>
										{(item) => listProps.listItemRender(item)}
									</ListResultItems>
								</>
							)}
						</Tbody>
					</Table>
				</TableContainer>
			</div>
			{useFilter && (
				<>
					<div className={"col-span-3 ml-6 2xl:col-span-2"}>
						<ListFilter
							onFilterApply={filterProps.onFilterApply}
							onFilterReset={filterProps.onFilterReset}
						/>
					</div>
				</>
			)}
		</>
	);
}

export default TableListBody;
