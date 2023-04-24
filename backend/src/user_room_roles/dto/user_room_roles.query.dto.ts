import { Transform, Type } from "class-transformer";
import { IsArray, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasValidFields } from "../../common/decorators/order.decorator";
import { BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class UserRoomRolesQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    userRoomId?: number[];

    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    roleId?: number[];
}

export class UserRoomRolesQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'userRoomId', 'roleId', 'createdAt'])
    sort?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => UserRoomRolesQueryFilterDto)
    filter?: UserRoomRolesQueryFilterDto;
}