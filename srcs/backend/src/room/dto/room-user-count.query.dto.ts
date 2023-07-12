import { Transform } from "class-transformer";
import {
    IsArray,
    IsOptional
} from "class-validator";
import {
    HasValidFields,
    ValidateOrder
} from "src/common/decorators/order.decorator";
import { BaseQueryDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

export class    RoomUserCountQueryDto extends BaseQueryDto {
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    @HasValidFields(['id'])
    @ValidateOrder()
    order?: string[];

    @IsOptional()
    roleName?: string;
}
