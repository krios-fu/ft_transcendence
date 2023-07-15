import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields } from "../../common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class RoleQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    role: string[];
}

export class RoleQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'role', 'createdAt'])
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoleQueryFilterDto)
    filter?: RoleQueryFilterDto;
}