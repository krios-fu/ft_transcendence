import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { BaseQueryDto } from "src/common/dtos/base.query.dto";

export class    MatchQueryDto extends BaseQueryDto {
    @IsOptional()
    @Type(() => String)
    username?: string;
}
