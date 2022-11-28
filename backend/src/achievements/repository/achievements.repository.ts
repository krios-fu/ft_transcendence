import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AchievementEntity } from "../entity/achievement.entity";

@Injectable()
export class AchievementsRepository extends Repository<AchievementEntity> { }