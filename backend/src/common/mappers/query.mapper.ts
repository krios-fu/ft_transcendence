import { FindOperator, Like } from "typeorm";
import { IQueryParams } from "../interfaces/queryparams.interface";

export class QueryMapper {
    constructor(queryParams: IQueryParams) {
        const { limit, offset, order, filter } = queryParams; 
        if (limit !== undefined) {
            this.take = limit;
        }
        if (offset !== undefined) {
            this.skip = offset;
        }
        if (order !== undefined) {
            this.order = {};
            order.forEach((value: string) => {
                Object.assign(this.order, { [value]: 'ASC' })
            });
        }
        if (filter !== undefined) {
            this.where = [];
            for (let key in filter) {
                filter[key].forEach((value: string) => {
                    if (key === 'username' || key === 'roomName') {
                        this.where.push({ [key]: Like(`${value}%`) });
                    }
                    else {
                        this.where.push({ [key]: value });
                    }
                });
            }
        }
    }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: FindOperator<string> | string}[];
}