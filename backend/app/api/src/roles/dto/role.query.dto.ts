import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/filter.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";

class RoleQueryFilterDto extends BaseQueryFilterDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        let ids = new Array<string>();
        let params = (!Array.isArray(value)) ? [ value ] : value;

        params.forEach((params: string) => {
            params.split(',').filter(Boolean).forEach((param: string) => {
                ids.push(param);
            });
        });
        return ids;
    })
    role: string[];
}

export class RoleQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'role', 'createdAt'])
    sort?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoleQueryFilterDto)
    filter?: RoleQueryFilterDto;
}