import { IsOptional, IsString } from "class-validator";

export class BanQueryDto {
    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    filter?: string[];

    @IsOptional()
    range?: string[];
}