import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
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

/* transform into array, then transform into number array */

export class BaseQueryFilterDto {
    @IsOptional()
    @Transform(({ value }) => intoArrayOfParams(value))
    @IsNumber({ allowNaN: false }, { each: true })
    @Type((() => Number))
    id?: number[];
}