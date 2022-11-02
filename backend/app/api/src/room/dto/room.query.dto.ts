import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields, ValidateOrder } from "src/common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

class RoomQueryFilterDto extends BaseQueryFilterDto { 
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomName?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    ownerId?: string[];
}

export class RoomQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    @HasValidFields(['id', 'roomName', 'createdAt', 'ownerId'])
    @ValidateOrder()
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoomQueryFilterDto)
    filter?: RoomQueryFilterDto;
}
