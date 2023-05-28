import { Transform, Type } from "class-transformer";
import { IsArray, IsNumberString, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields } from "../../common/decorators/order.decorator";
import { BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class UserRoomQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    userId?: number[];

    @IsOptional()
    @IsArray()
    @IsNumberString({}, { each: true })
    @Transform(({ value }) => intoArrayOfParams(value))
    roomId?: number[];
}

export class UserRoomQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'userId', 'roomId', 'createdAt'])
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => UserRoomQueryFilterDto)
    filter?: UserRoomQueryFilterDto;
}