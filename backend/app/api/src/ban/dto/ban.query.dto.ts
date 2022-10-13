import { IsOptional, IsString } from "class-validator";

export class BanQueryDto {
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