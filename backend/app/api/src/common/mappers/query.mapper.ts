import { IQueryParams } from "../interfaces/queryparams.interface";

export class QueryMapper {
    constructor(queryParams: IQueryParams) {
        /* here conv. logic */
        const { limit, offset, order, filter } = queryParams; 
        if (limit !== undefined) {
            this.limit = limit;
        }
        if (limit !== undefined) {
            this.offset = offset;
        }
        if (order !== undefined) {
            /* tal */
        }
        if (filter !== undefined) {
            /* tal */
        }
    }
    limit?: number;
    offset?: number;
    order?: Map<string, string>;
    where?: Map<string, string[]>;
}

/* {
    where: [
        "id": tal,
        "id": cual,
        "name": otro,
    ]
}
*/
/* where: {
    "id": tal,
    "id": cual,
}
*/