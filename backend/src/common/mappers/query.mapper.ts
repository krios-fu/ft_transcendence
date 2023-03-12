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
            let tmp = [];
            console.log('filter: ', filter);
            for (let key in filter) {
                console.log('key:, ', key);
                tmp.push(filter[key].map(
                    function(e: string) {
                        return { [key]: e };
                    }
                ));
            }
            console.log('test: ', tmp);
            let new_arr = tmp.reduce((acc, cv) => {
                console.log('acc, cv: ', acc, cv);
                //console.log('test in cb: ', [[1,2,3]].map(acci => {
                //    console.log('acci, ', acci);
                //    return cv.map(cvi => {
                //        console.log('cvi, ', cvi);
                //        return acci.push(cvi)
                //    })
                //}));
                return acc.map(acci => {
                    console.log('acci, ', acci);
                    return cv.map(cvi => {
                        console.log('cvi, ', cvi);
                        return acci.push(cvi)
                    })
                })
            }, []);
            console.log('new arr: ', new_arr);

        //        console.log("FILTER IN KEY: ", filter[key])
        //        filter[key].forEach((value: string) => {
        //            if (key === 'nickName' || key === 'roomName') {
        //                this.where.push({ [key]: Like(`${value}%`) });
        //            }
        //            else {
        //                this.where.push({ [key]: value });
        //            }
        //        });
            }
        }
    take?: number;
    skip?: number;
    order?: { [key: string]: string }
    where?: { [key: string]: FindOperator<string> | string}[];
}