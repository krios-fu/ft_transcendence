import { Injectable } from "@angular/core";
import { AStage, StageName } from "../elements/AStage";
import { IMatchInitData } from "../elements/Match";
import { MatchScene } from "../scenes/MatchScene";
import { SoundService } from "./sound.service";

@Injectable({
    providedIn: 'root'
})
export class    LoadService {

    private static readonly _matchOtherSounds: Map<string, string> = new Map([
        [SoundService.matchOtherSoundKeys.collision, '/assets/collision.mp3'],
        [SoundService.matchOtherSoundKeys.point, '/assets/point.mp3']
    ]);
    private static readonly _stageSoundPaths: Map<string, string> = new Map([
        [SoundService.stageSoundKeys.atlantis, '/assets/atlantis.mp3'],
        [SoundService.stageSoundKeys.metropolis, '/assets/metropolis.mp3'],
        [SoundService.stageSoundKeys.wakanda, '/assets/wakanda.mp3']
    ]);
    private static readonly _stageImagePaths: Map<string, string> = new Map([
        [AStage.stageKeys.atlantis, '/assets/atlantis.png'],
        [AStage.stageKeys.atlantisBubbles, '/assets/atlantis_bubbles.png'],
        [AStage.stageKeys.metropolis, '/assets/metropolis.png'],
        [AStage.stageKeys.metropolisClouds, '/assets/metropolis_clouds.png'],
        [AStage.stageKeys.wakanda, '/assets/wakanda.png'],
        [AStage.stageKeys.wakandaCity, '/assets/wakanda_city.png'],
        [AStage.stageKeys.wakandaJungle, '/assets/wakanda_jungle.png']
    ]);
    private static readonly _heroImagePaths: Map<string, string> = new Map([
        ['aquaman', '/assets/aquaman.png'],
        ['superman', '/assets/superman.png'],
        ['blackPanther', '/assets/blackPanther.png']
    ]);

    private _matchHero(scene: MatchScene, hero: string): void {
        const   path: string | undefined =
                        LoadService._heroImagePaths.get(hero);
    
        if (!path)
            return
        scene.load.image(
            hero,
            LoadService._heroImagePaths.get(hero)
        );
    }

    private _matchOtherSounds(scene: MatchScene): void {
        const   collision: string = SoundService.matchOtherSoundKeys.collision;
        const   point: string = SoundService.matchOtherSoundKeys.point;
    
        scene.load.audio(collision,
            LoadService._matchOtherSounds.get(collision)
        );
        scene.load.audio(point,
            LoadService._matchOtherSounds.get(point)
        );
    }

    private _matchStageSounds(scene: MatchScene, stage: StageName): void {
        const   key: string | undefined =
                        SoundService.stageSoundKeysMap.get(stage);
        let     path: string | undefined;

        if (!key)
            return ;
        path = LoadService._stageSoundPaths.get(key);
        if (path)
            scene.load.audio(key, path);
    }

    private _matchStage(scene: MatchScene, stage: StageName): void {
        const   keys: string[] | undefined = AStage.stageKeyGroups.get(stage);
        let     path: string | undefined;
    
        if (!keys)
            return ;
        keys.forEach((key) => {
            if (!key)
                return ;
            path = LoadService._stageImagePaths.get(key);
            if (!path)
                return ;
            scene.load.image(key, path);
        });
    }

    match(scene: MatchScene, data: IMatchInitData): void {
        this._matchStage(scene, data.stage);
        if (data.playerA.hero && data.playerB.hero)
        {
            this._matchHero(scene, data.playerA.hero?.name);
            if (data.playerB.hero?.name != data.playerA.hero?.name)
                this._matchHero(scene, data.playerB.hero?.name);
        }
        if (data.stage === undefined)
            return ;
        this._matchStageSounds(scene, data.stage);
        this._matchOtherSounds(scene);
    }
    
}
