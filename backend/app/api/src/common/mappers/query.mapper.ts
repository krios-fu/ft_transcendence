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
            for (let value in order) {
                this.order.value = 'ASC';
                //Object.assign(this.order, { value: 'ASC' });
            }
        }
        if (filter !== undefined) {
            for (let key in filter) {
                for (let value in filter[key]) {
                    this.where.push({ key: value });
                }
            }
        }
    }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: string }[];
}