import { IsOptional } from "class-validator";

export class RoleQueryDto {
    @IsOptional()
    sort: string[];

    @IsOptional()
    filter: string[];

    @IsOptional()
    range: string[];
}