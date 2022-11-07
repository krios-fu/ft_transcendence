import { IsNotEmpty, IsNumberString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateBanDto { 
    @IsNotEmpty()
    @IsNumberString() 
    userId: number;

    @IsNotEmpty()
    @IsNumberString() 
    roomId: number;
}

export class UpdateBanDto extends PartialType(CreateBanDto) { }