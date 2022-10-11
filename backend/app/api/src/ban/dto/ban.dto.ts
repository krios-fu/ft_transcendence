import { IsNumber } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateBanDto { 
    @IsNumber() userId: number;
    @IsNumber() roomId: number;
}

export class UpdateBanDto extends PartialType(CreateBanDto) { }