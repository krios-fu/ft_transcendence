import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

class RoomRolesQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomId?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roleId?: string[];
}

export class RoomRolesQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'roomId', 'roleId', 'createdAt'])
    sort?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoomRolesQueryFilterDto)
    filter?: RoomRolesQueryFilterDto;
}