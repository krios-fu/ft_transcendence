import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

/* Base query implements pagination for all query parameters in every route */
export class BaseQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;
}

export class BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        let ids = new Array<string>();
        let params = (!Array.isArray(value)) ? [ value ] : value;

        params.forEach((params: string) => {
            params.split(',').filter(Boolean).forEach((param: string) => {
                ids.push(param);
            });
        });
        return ids;
    })
    id?: string[];
}