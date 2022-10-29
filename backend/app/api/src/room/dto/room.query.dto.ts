import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from "class-validator";

export class RoomQueryFilterDto { 
    private queryIntoArray(value: string | Array<string>): Array<string> {
        let ids = new Array<string>();

        if (!Array.isArray(value)) {
            value.split(',').forEach((param: string) => {
                ids.push(param);
            });
        } else {
            value.forEach((params: string) => {
                params.split(',').forEach((param: string) => {
                    ids.push(param);
                });
            });
        }
        return ids;
    }

    @IsOptional()
    //@Type(() => String)
    //@Transform(({ value }) => Number(value), { toPlainOnly: true })
    @IsArray()
    @Transform(({ value }) => this.queryIntoArray(value))
    id?: number;

    @IsOptional()
    @IsString()
    roomName?: string;

    @IsOptional()
    @IsString()
    ownerId?: string;
}

export class RoomQueryRangeDto extends RoomQueryFilterDto { 
    @IsOptional()
    @IsDate()
    createdAt?: Date;
}

export class RoomQueryDto {
    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.split(','))
    order?: string[];

    @IsOptional()
    @ValidateNested({
        message: ''
    })
    @Type(() => RoomQueryFilterDto)
    filter?: RoomQueryFilterDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => RoomQueryRangeDto)
    range?: RoomQueryRangeDto;
}
