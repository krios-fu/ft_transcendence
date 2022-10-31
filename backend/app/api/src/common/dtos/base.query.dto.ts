import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

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