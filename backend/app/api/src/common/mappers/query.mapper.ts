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
            for (let value in order) {
                //this.order.value = 'ASC';
                console.log('lo de value: ' + value);
                Object.assign(this.order, { value: 'ASC' });
            }
        }
        if (filter !== undefined) {
            this.where = [];
            for (let key in filter) {
                for (let thisValue in filter[key]) {
                    console.log('is where an array of algo? ' + typeof(this.where));
                    this.where.push({ key: thisValue });
                }
            }
        }
    }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: string }[];
}