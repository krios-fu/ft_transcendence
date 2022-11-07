import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/order.decorator";
import { BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

class UserRoomQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    userId?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomId?: string[];
}

export class UserRoomQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'userId', 'roomId', 'createdAt'])
    sort?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => UserRoomQueryFilterDto)
    filter?: UserRoomQueryFilterDto;
}