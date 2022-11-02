import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";
import { intoArrayOfParams } from "../validators/fields-validator.class";

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
    @IsNumber({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    @Type((() => Number))
    id?: number[];
}