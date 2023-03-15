import { FindOperator, Like } from "typeorm";
import { IQueryParams } from "../interfaces/queryparams.interface";

const filterSetup = filter => { 
    let keyFilter = [];
    for (let key in filter) {
        keyFilter.push(filter[key].map(value => {
            return ['nickName', 'roomName'].includes(key) ?
                { [key]: Like(`${value}%`) } :
                { [key]: value };
            })
        );
    }
    return keyFilter;
}
const cartesian = (...f) => f.reduce((ac,cv) => ac.flatMap((aci) => cv.map((cvi) => [aci,cvi].flat())))

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
            console.log('filter: ', filter);
            console.log('2nd: ', filterSetup(filter));
            console.log('3rd: ', cartesian(filterSetup(filter)));
            this.where = cartesian(filterSetup(filter));
        //        console.log("FILTER IN KEY: ", filter[key])
        //        filter[key].forEach((value: string) => {
        //            if (key === 'nickName' || key === 'roomName') {
        //                this.where.push({ [key]: Like(`${value}%`) });
        //            }
        //            else {
        //                this.where.push({ [key]: value });
        //            }
        //        });
            console.log('query: ', this.where);
            }
        }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: FindOperator<string> | string}[];
}