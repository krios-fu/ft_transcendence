import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { HasValidFields } from "src/common/decorators/filter.decorator";
import { BaseQueryDto, BaseQueryFilterDto } from "src/common/dtos/base.query.dto";

class RoomRolesQueryFilterDto extends BaseQueryFilterDto {
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
    roomId?: string[];

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
    roleId?: string[];
}

export class RoomRolesQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    @HasValidFields(['id', 'roomId', 'roleId', 'createdAt'])
    sort?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoomRolesQueryFilterDto)
    filter?: RoomRolesQueryFilterDto;
}