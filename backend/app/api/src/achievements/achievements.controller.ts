import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/achievement.dto';
import { AchievementEntity } from './entity/achievement.entity';

@Controller('achievements')
export class AchievementsController {
    constructor (
        private readonly achievementsService: AchievementsService,
    ) { 
        this.achievementsLogger = new Logger(AchievementsController.name);
    }
    private readonly achievementsLogger: Logger;

    /*
    ** Get all achievements available in application.
    */

    @Get()
    public async getAllAchievements(): Promise<AchievementEntity[]> {
        return await this.achievementsService.getAllAchievements();
    }

    /*
    ** Get one achievement by id.
    */

    @Get(':id')
    public async getOneAchievement(@Param('id', ParseIntPipe) id: number): Promise<AchievementEntity> {
        const user = await this.achievementsService.getOneAchievement(id);
        if (user === null) {
            this.achievementsLogger.error(`No achievement with id ${id} found in database`);
            throw new HttpException('no achievement in db', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    /*
    ** Create a new achievement for the application.
    */
   
// @UseGuards(IsAdmin)
   @Post()
   public async createAchievement(@Body() dto: CreateAchievementDto): Promise<AchievementEntity> {
        return await this.achievementsService.createAchievement(dto);
   }

   /*
   ** Remove an achievement from database.
   */

// @UseGuards(IsAdmin)   
   @Delete(':id')
   public async deleteAchievement(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.achievementsService.deleteAchievement(id);
   }


}
