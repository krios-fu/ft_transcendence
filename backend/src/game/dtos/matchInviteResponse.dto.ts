import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class    MatchInviteResponseDto {
    @IsNotEmpty()
    @IsString()
    roomId: string;

    @IsBoolean()
    @Transform(({ value } ) => value === 'true') //Strings !== 'true' are converted to false
    accept: boolean;
}
