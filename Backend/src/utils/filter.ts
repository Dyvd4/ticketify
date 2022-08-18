import Object from "lodash"
import { prisma } from "../server"

type FilterOperation = "contains" | "equals" | "gt" | "lt"

export type FilterQueryParam = {
    property: string,
    operation: FilterOperation
    value: any
}

export type FilterQueryParams = Array<FilterQueryParam>

export const mapFilterQuery = (query) => {
    if (!query.filter) return {};
    const filter: FilterQueryParams = JSON.parse((query.filter) as string);
    let test = filter.reduce((map, filter) => {
        Object.set(map, `AND.${filter.property}.${filter.operation}`, filter.value);
        return map;
    }, {})
    return test;
}

// (async () => {
//     const tickets = await prisma.ticket.findMany({
//         include: {
//             priority: true
//         },
//         where: {
//             AND: {
//                 title: {
//                     equals: "value"
//                 }
//             }
//         }
//     });
//     const filter = [
//         {
//             property: "title",
//             operation: "equals",
//             value: "test",
//         },
//         {
//             property: "priority.name",
//             operation: "equals",
//             value: "Not very low",
//         }
//     ];
// })
