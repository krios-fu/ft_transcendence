import { BaseQueryFilterDto } from "../dtos/base.query.dto";

/* Common interface for all routes' query parameters */
export interface IQueryParams {
    offset?: number;
    limit?:  number;
    order?:  string[];
    orderDesc?: string[];
    filter?: BaseQueryFilterDto;
}
