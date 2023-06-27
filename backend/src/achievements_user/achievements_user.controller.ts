import { Body,
    Controller,
    Delete,
    Get,
    BadRequestException,
    Logger,
    Param,
    ParseIntPipe,
    Post,
    Query } from '@nestjs/common';
import { AchievementsService } from 'src/achievements/achievements.service';
import { AchievementEntity } from 'src/achievements/entity/achievement.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { AchievementsUserService } from './achievements_user.service';
import { AchievementsUserQueryDto } from './dto/achievements_user.query.dto';
import { CreateAchievementUserDto } from './dto/achievement_user.dto';
import { AchievementUserEntity } from './entity/achievement_user.entity';

@Controller('achievements_user')
export class AchievementsUserController {
    constructor (
        private readonly achievementsService: AchievementsService,
        private readonly userService: UserService,
        private readonly achievementsUserService: AchievementsUserService,
    ) { 
        this.achievementsUserLogger = new Logger(AchievementsUserController.name);
    }
    private readonly achievementsUserLogger: Logger;

    @Get()
    public async getAllAchievementsUser(@Query() queryParams: AchievementsUserQueryDto): Promise<AchievementUserEntity[]> {
        return await this.achievementsUserService.getAllAchievementsUser(queryParams);
    }

    @Get(':id')
    public async getOneAchievementUser(@Param('id', ParseIntPipe) id: number): Promise<AchievementUserEntity> {
        const achUsr: AchievementUserEntity = await this.achievementsUserService.getOneAchievementUser(id);

        if (achUsr === null) {
            this.achievementsUserLogger.error(`No achievement user with id ${id} present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return achUsr;
    }

    @Get('/achievements/:id')
    public async getAllUsersWithAchievement(@Param('id', ParseIntPipe) id: number): Promise<UserEntity[]> {
        if (await this.achievementsService.getOneAchievement(id) === null) {
            this.achievementsUserLogger.error(`No achievement with id ${id} present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.userService.findAllUsersWithAchievement(id);
    }

    @Get('/users/:id')
    public async getAllAchievementsFromUser(@Param('id', ParseIntPipe) id: number): Promise<AchievementEntity[]> {
        if (await this.userService.findOne(id) === null) {
            this.achievementsUserLogger.error(`No user with id ${id} present in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.achievementsService.findAllAchievementsFromUser(id);
    }

    @Post()
    public async createAchievementUser(@Body() dto: CreateAchievementUserDto): Promise<AchievementUserEntity> {
        const { userId, achievementId } = dto;

        if (await this.achievementsService.getOneAchievement(achievementId) === null) {
            this.achievementsUserLogger.error(`Achievement with id ${achievementId} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        if (await this.userService.findOne(userId) === null) {
            this.achievementsUserLogger.error(`User with id ${userId} not found in database`);
            throw new BadRequestException('resource not found in database');
        }
        return await this.createAchievementUser(dto);
    }

    @Delete(':id')
    public async removeAchievementUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.removeAchievementUser(id);
    }
}
