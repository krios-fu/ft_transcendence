import { Transform, Type } from "class-transformer";
import { IsArray, IsNumberString, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields, ValidateOrder } from "../../common/decorators/order.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "../../common/dtos/base.query.dto";
import { intoArrayOfParams } from "../../common/validators/fields-validator.class";

class BanQueryFilterDto extends BaseQueryFilterDto { 
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

export class BanQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    @HasValidFields(['id', 'userId', 'createdAt', 'roomId'])
    @ValidateOrder()
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => BanQueryFilterDto)
    filter?: BanQueryFilterDto;
}
