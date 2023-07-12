import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnInit,
} from '@angular/core';
import {
    AchievementData,
    AchievementsService,
    UserAchievement
} from './achievements.service';

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit, AfterViewInit, OnChanges {

    achievements: AchievementData[];
    @Input() username ?: string;


    constructor(
        private readonly achievementsService: AchievementsService,
    ) {
        this.achievements = [];
    }

    ngOnInit(): void {
 
    }

    ngAfterViewInit(): void {
    }

    ngOnChanges(): void {
        this.getAchievements();
    }

    getAchievements(): void {
        this.achievementsService.getAchievements(this.username as string)
        .subscribe({
            next: (userAchievements: UserAchievement[]) => {
                this.achievements = this.achievementsService.userToAchievement(
                    userAchievements
                );
            },
            error: (err) => {
                console.error(err);
            }
        });

    }

}
