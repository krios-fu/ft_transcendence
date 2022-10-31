import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/filter.decorator";
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
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'roomName', 'createdAt', 'ownerId'])
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoomQueryFilterDto)
    filter?: RoomQueryFilterDto;
}
