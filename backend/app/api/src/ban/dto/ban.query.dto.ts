import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields, ValidateOrder } from "src/common/decorators/order.decorator";
import { BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

class BanQueryFilterDto extends BaseQueryFilterDto { 
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    userId?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    roomId?: string[];
}

export class BanQueryDto {
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
