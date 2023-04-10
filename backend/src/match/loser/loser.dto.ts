import { UserEntity } from "src/user/entities/user.entity";
import { Category } from "src/user/enum/category.enum";

export class   LoserDto {
    user: UserEntity;
    ranking: number;
    category: Category;
    score: number;
}
