import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AchievementUserEntity } from "../entity/achievement_user.entity";

@Injectable()
export class AchievementsUserRepository extends Repository<AchievementUserEntity> { }