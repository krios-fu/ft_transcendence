import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AchievementsService } from 'src/achievements/achievements.service';
import { UserService } from 'src/user/services/user.service';
import { AchievementsUserService } from './achievements_user.service';
import { CreateAchievementUserDto } from './dto/achievement_user.dto';
import { AchievementUserEntity } from './entity/achievement_user.entity';

@Controller('achievements-user')
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
    public async getAllAchievementsUser(): Promise<AchievementUserEntity[]> {
        return await this.achievementsUserService.getAllAchievementsUser();
    }

    @Get(':id')
    public async getOneAchievementUser(@Param('id', ParseIntPipe) id: number): Promise<AchievementUserEntity> {
        const achUsr = await this.achievementsUserService.getOneAchievementUser(id);
        if (achUsr === null) {
            this.achievementsUserLogger.error(`No achievement user with id ${id} present in database`);
            throw new HttpException('no achievement user in db', HttpStatus.BAD_REQUEST);
        }
        return achUsr;
    }

    @Post()
    public async createAchievementUser(@Body() dto: CreateAchievementUserDto): Promise<AchievementUserEntity> {
        const { userId, achievementId } = dto;
        if (await this.achievementsService.getOneAchievement(achievementId) === null) {
            this.achievementsUserLogger.error(`Achievement with id ${achievementId} not found in database`);
            throw new HttpException('no achievement in db', HttpStatus.BAD_REQUEST);
        }
        if (await this.userService.findOne(userId) === null) {
            this.achievementsUserLogger.error(`User with id ${userId} not found in database`);
            throw new HttpException('no user found in db', HttpStatus.BAD_REQUEST);
        }
        return await this.createAchievementUser(dto);
    }

    @Delete(':id')
    public async removeAchievementUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        /* a testear */
        const testing = await this.removeAchievementUser(id);
        console.log("testing testings..." + testing);
        return testing;
    }
}
