import { IQueryParams } from "../interfaces/queryparams.interface";

export class QueryMapper {
    constructor(queryParams: IQueryParams) {
        const { limit, offset, order, filter } = queryParams; 
        if (limit !== undefined) {
            this.limit = limit;
        }
        if (limit !== undefined) {
            this.offset = offset;
        }
        if (order !== undefined) {
            for (let value in order) {
                order[value] = 'ASC';
            }
        }
        if (filter !== undefined) {
            for (let key in filter) {
                for (let value in filter[key]) {
                    this.where.push(new Map(Object.entries({ key: value })));
                }
            }
        }
    }
    limit?: number;
    offset?: number;
    order?: Map<string, string>;
    where?: Map<string, string>[];
}