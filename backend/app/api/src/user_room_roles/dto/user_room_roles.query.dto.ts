import { Transform, Type } from "class-transformer";
import { IsArray, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/order.decorator";
import { BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

class UserRoomRolesQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    userRoomId?: string[];

    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    roleId?: string[];
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