/* Common interface for all routes' query parameters */
export interface IQueryParams {
    offset?: number;
    limit?:  number;
    order?:  string[];

    @Transform
    filter?: 
}