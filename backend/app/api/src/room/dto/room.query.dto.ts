import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class RoomQueryFilterDto { 
    @IsOptional()
    @IsNumber()
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
    @IsString()
    sort?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => RoomQueryFilterDto)
    filter?: RoomQueryFilterDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => RoomQueryRangeDto)
    range?: RoomQueryRangeDto;
}

