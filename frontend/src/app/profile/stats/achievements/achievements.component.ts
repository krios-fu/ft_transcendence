import {
    AfterViewInit,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    AchievementData,
    AchievementsService,
    UserAchievement
} from './achievements.service';
import { SharedService } from '../../profile/profile-user/profile-user.component';

@Component({
    selector: 'app-achievements',
    templateUrl: './achievements.component.html',
    styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit, AfterViewInit, OnChanges {

    achievements: AchievementData[];
    @Input() username ?: string;

    // private _username?: string;

    constructor(
        private readonly achievementsService: AchievementsService,
        private readonly route: ActivatedRoute,
        private shareService: SharedService
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
