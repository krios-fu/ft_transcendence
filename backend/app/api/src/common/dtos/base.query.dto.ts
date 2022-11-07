import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { intoArrayOfParams } from "../validators/fields-validator.class";

/* Base query implements pagination for all query parameters in every route */
export class BaseQueryDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    offset?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number;
}

export class BaseQueryFilterDto {
    @IsOptional()
    @IsNumberString({}, { each: true })
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    id?: number[];
}