import { IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateBanDto { 
    @IsString() user_id: string;
    @IsString() room_id: string;
}

export class UpdateBanDto extends PartialType(CreateBanDto) { }