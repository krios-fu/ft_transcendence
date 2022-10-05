import { IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateBanDto { 
    @IsString() userId: string;
    @IsString() roomId: string;
}

export class UpdateBanDto extends PartialType(CreateBanDto) { }