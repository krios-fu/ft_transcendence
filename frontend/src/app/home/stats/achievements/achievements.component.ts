import {
    AfterViewInit,
    Component,
    OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class AchievementsComponent implements OnInit, AfterViewInit {

    achievements: AchievementData[];

    private _username: string;

    constructor(
        private readonly achievementsService: AchievementsService,
        private readonly route: ActivatedRoute
    ) {
        this.achievements = [];
        this._username = this.route.snapshot.params['id'];
    }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.getAchievements();
    }

    getAchievements(): void {
        this.achievementsService.getAchievements(this._username)
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
