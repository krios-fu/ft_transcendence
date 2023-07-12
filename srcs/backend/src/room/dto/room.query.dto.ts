import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumberString, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields, ValidateOrder } from "../../common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class RoomQueryFilterDto extends BaseQueryFilterDto { 
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomName?: string[];

    @IsOptional()
    @IsNumberString({}, { each: true })
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    ownerId?: number[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomRole?: string[];
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

    @IsOptional()
    @IsBoolean()
    @Transform(({ value} ) => value === 'true') //Strings !== 'true' are converted to false
    count?: boolean;
}
