import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields } from "../../common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class RoomRolesQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomId?: number[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roleId?: number[];
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

    @IsOptional()
    @IsBoolean()
    @Transform(({ value} ) => value === 'true') //Strings !== 'true' are converted to false
    count?: boolean;
}
