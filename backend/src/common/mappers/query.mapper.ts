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
//const cartesian = (...f) => f.reduce((ac,cv) => ac.flatMap((aci) => cv.map((cvi) => [aci,cvi].flat())))
const cartesian = (...f) => f.reduce((ac,cv) => ac.flatMap((aci) => cv.map((cvi) => Object.assign({}, aci, cvi))))

export class QueryMapper {
    constructor(queryParams: IQueryParams) {
        const { limit, offset, order, orderDesc, filter } = queryParams; 
        if (limit !== undefined) {
            this.take = limit;
        }
        if (offset !== undefined) {
            this.skip = offset;
        }
        if (order !== undefined
                || orderDesc !== undefined) {
            this.order = {};
            order?.forEach((value: string) => {
                Object.assign(this.order, { [value]: 'ASC' })
            });
            orderDesc?.forEach((value: string) => {
                Object.assign(this.order, { [value]: 'DESC' })
            });
        }
        if (filter !== undefined) {
            this.where = cartesian(...filterSetup(filter));
        }
    } 
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: FindOperator<string> | string}[];
}
