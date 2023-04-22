import { UserEntity } from "src/user/entities/user.entity";
import { Category } from "src/user/enum/category.enum";

export class   WinnerDto {
    user: UserEntity;
    ranking: number;
    category: Category;
    score: number;
}
