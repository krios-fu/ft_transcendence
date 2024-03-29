import { IsNotEmpty, IsString } from "class-validator";

export class CreateAchievementDto {
    @IsString()
    @IsNotEmpty()
    achievementName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    photoUrl: string;
}
