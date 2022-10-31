/* Common interface for all routes' query parameters */
export interface IQueryParams {
    limit?:  number;
    offset?: number;
    order?:  string[];
    filter?: Map<string, string[]>;
}