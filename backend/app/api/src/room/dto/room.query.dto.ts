import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class RoomQueryFilterDto { 
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
    id?: string;

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
    roomName?: string;

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
    ownerId?: string;
}

export class RoomQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: 'invalid parameter passed to filter option'
    })
    @Type(() => RoomQueryFilterDto)
    filter?: RoomQueryFilterDto;

    @IsOptional()
    @IsNumber()
    offset?: number

    @IsOptional()
    @IsNumber()
    limit?: number;
}
