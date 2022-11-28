import { IsNotEmpty, IsString } from "class-validator";

export class CreateAchievementDto {
    @IsString()
    @IsNotEmpty()
    achievementName: string;

    @IsString()
    @IsNotEmpty()
    photoUrl: string;
}