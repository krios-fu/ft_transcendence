import { IsOptional, IsString } from "class-validator";

export class UserRoomQueryDto {
    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsString({ each: true })
    filter?: Map<string, string>;

    @IsOptional()
    @IsString({ each: true })
    range?: Map<string, string>;
}