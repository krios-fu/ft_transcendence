import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

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
    sort?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoleQueryFilterDto)
    filter?: RoleQueryFilterDto;
}