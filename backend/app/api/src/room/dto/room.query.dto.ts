import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString, ValidateNested } from "class-validator";

export class RoomQueryFilterDto { 
    @IsOptional()
    //@Type(() => String)
    //@Transform(({ value }) => Number(value), { toPlainOnly: true })
    @IsArray()
    @Transform(({ value }) => {
        value.array.forEach(params => {
            value.push(params.split(','))
        });
        return value;
    })
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
    @ValidateNested()
    @Type(() => RoomQueryFilterDto)
    filter?: RoomQueryFilterDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => RoomQueryRangeDto)
    range?: RoomQueryRangeDto;
}
