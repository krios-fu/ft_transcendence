import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";
import { intoArrayOfParams } from "src/common/validators/fields-validator.class";

export class    AchievementsUserQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => intoArrayOfParams(value))
    userId?: number[];
}

export class    AchievementsUserQueryDto extends BaseQueryDto {
    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => AchievementsUserQueryFilterDto)
    filter?: AchievementsUserQueryFilterDto;
}
