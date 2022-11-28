import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateAchievementUserDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    achievementId: number;
}