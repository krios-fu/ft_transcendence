import { IQueryParams } from "../interfaces/queryparams.interface";

export class QueryMapper {
    constructor(queryParams: IQueryParams) {
        const { limit, offset, order, filter } = queryParams; 
        if (limit !== undefined) {
            this.take = limit;
        }
        if (limit !== undefined) {
            this.skip = offset;
        }
        if (order !== undefined) {
            this.order = {};
            order.forEach((value) => {
                Object.assign(this.order, { [value]: 'ASC' })
            });
        }
        if (filter !== undefined) {
            this.where = [];
            for (let key in filter) {
                filter[key].forEach((value) => {
                    this.where.push({ [key]: value });
                })
            }
        }
    }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: string }[];
}