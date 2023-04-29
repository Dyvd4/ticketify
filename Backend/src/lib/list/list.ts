import Object from "lodash";
import { ListResultPrismaArgs } from ".";

export type FilterQueryParam = {
	type: FilterOperationsType
	property: string
	value?: string
	operation?: Omit<FilterOperation, "label">
	disabled?: boolean
}
export type FilterOperationsType = "string" | "number" | "date" | "boolean"
export type FilterOperation = {
	label: string
	value: string
}
export type FilterQueryParams = Array<FilterQueryParam>
export type OrderByQueryParam = {
	property: string
	direction: {
		label: string
		value: "desc" | "asc"
	},
	disabled?: boolean
}
export type OrderByQueryParams = Array<OrderByQueryParam>

export default class List {

	protected prismaArgs: ListResultPrismaArgs;
	protected itemsPerLoad: number

	constructor(
		private prismaFilter: FilterQueryParams,
		private prismaOrderBy: OrderByQueryParams | OrderByQueryParam,
		prismaArgs: ListResultPrismaArgs,
		itemsPerLoad: number
	) {
		this.prismaArgs = prismaArgs;
		this.itemsPerLoad = itemsPerLoad;
	}

	getPrismaArgs = () => this.prismaArgs;

	getPrismaFilterArgs = () => getMappedPrismaFilterArgs(this.prismaFilter);

	getPrismaOrderByArgs = () => getMappedPrismaOrderByArgs(this.prismaOrderBy);
}

export const getMappedPrismaFilterArgs = (prismaFilter: FilterQueryParams) => {
	const getParsedFilterValue = (value, type: FilterOperationsType) => {
		switch (type) {
			case "boolean":
				return Boolean(parseInt(value))
			case "date":
				return value
					? new Date(value)
					: undefined
			default:
				return value
		}
	}

	const mappedFilter = prismaFilter
		.filter(filter => !filter.disabled)
		.reduce((map, filter) => {
			if (filter.value !== null && filter.value !== "") {
				Object.set(map, `AND.${filter.property}.${filter.operation?.value}`, getParsedFilterValue(filter.value, filter.type));
			}
			return map;
		}, {})
	return mappedFilter;
}

export const getMappedPrismaOrderByArgs = (prismaOrderBy: OrderByQueryParams | OrderByQueryParam) => {
	const mappedOrderBy = (orderBy: OrderByQueryParam) => {
		const orderByObj = {};
		Object.set(orderByObj, orderBy.property, orderBy.direction.value);
		return orderByObj;
	}

	if ("length" in prismaOrderBy) {
		return prismaOrderBy
			.filter(orderBy => !orderBy.disabled)
			.map(mappedOrderBy);
	}

	return [mappedOrderBy(prismaOrderBy)];
}