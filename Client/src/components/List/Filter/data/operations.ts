export const operations = {
	contains: {
		label: "contains",
		value: "contains",
	},
	equals: {
		label: "equals",
		value: "equals",
	},
	startsWith: {
		label: "starts with",
		value: "startsWith",
	},
	endsWith: {
		label: "ends with",
		value: "endsWith",
	},
	gt: {
		label: "greater than",
		value: "gt",
	},
	gte: {
		label: "greather than or equal",
		value: "gte",
	},
	lt: {
		label: "less than",
		value: "lt",
	},
	lte: {
		label: "less than or equal",
		value: "lte",
	},
	not: {
		label: "not",
		value: "not",
	},
};

export const typeOperations = {
	string: [
		operations.contains,
		operations.equals,
		operations.not,
		operations.startsWith,
		operations.endsWith,
	],
	number: [
		operations.lt,
		operations.gt,
		operations.not,
		operations.gte,
		operations.lte,
		operations.equals,
	],
	date: [
		operations.equals,
		operations.lt,
		operations.gt,
		operations.not,
		operations.gte,
		operations.lte,
	],
	boolean: [operations.equals, operations.not],
};
