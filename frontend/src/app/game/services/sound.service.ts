import { Injectable } from "@angular/core";
import { StageName } from "../elements/AStage";

export interface    SelectionSoundKeys {
    readonly change: string;
    readonly confirm: string;
    readonly finish: string;
    readonly theme: string;
}

export interface    StageSoundKeys {
    atlantis: string;
    metropolis: string;
    wakanda: string;
}

export interface    HeroSoundKeys {
    aquaman: string;
    blackPanther: string;
    superman: string;
}

export interface    MatchOtherSoundKeys {
    readonly collision: string;
    readonly point: string;
}

export interface    MatchSoundKeys {
    readonly stage: string;
    readonly heroA: string;
    readonly heroB: string;
    readonly collision: string;
    readonly point: string;
}

@Injectable({
    providedIn: 'root'
})
export class    SoundService {

    private _sounds: Map<string, Phaser.Sound.BaseSound>;
    private _currentSounds: Map<string, Phaser.Sound.BaseSound>;

    static readonly selectionSoundKeys: SelectionSoundKeys = {
        change: 'changeSelection',
        confirm: 'confirmSelection',
        finish: 'finishSelection',
        theme: 'themeSelection'
    };
    static readonly stageSoundKeys: StageSoundKeys = {
        atlantis: 'atlantisSound',
        metropolis: 'metropolisSound',
        wakanda: 'wakandaSound'
    }
    static readonly heroSoundKeys: HeroSoundKeys = {
        aquaman: 'aquamanSound',
        blackPanther: 'blackPantherSound',
        superman: 'supermanSound'
    }
    static readonly stageSoundKeysMap: Map<StageName, string> = new Map([
        [StageName.Atlantis, SoundService.stageSoundKeys.atlantis],
        [StageName.Metropolis, SoundService.stageSoundKeys.metropolis],
        [StageName.Wakanda, SoundService.stageSoundKeys.wakanda]
    ]);
    static readonly heroSoundKeysMap: Map<string, string> = new Map([
        ['aquaman', SoundService.heroSoundKeys.aquaman],
        ['blackPanther', SoundService.heroSoundKeys.blackPanther],
        ['superman', SoundService.heroSoundKeys.superman]
    ]);
    static readonly matchOtherSoundKeys: MatchOtherSoundKeys = {
        collision: 'collision',
        point: 'point'
    }

    constructor() {
        this._sounds = new Map();
        this._currentSounds = new Map();
    }

    destroy(): void {
        this._sounds.forEach((sound) => {
            sound.destroy();
        });
        this._sounds.clear();
        this._currentSounds.clear();
    }

    load(scene: Phaser.Scene, soundKeys: Object): void {
        const   keyArr: any[] = Object.values(soundKeys);
    
        this.destroy();
        for (let key of keyArr) {
            if (typeof key != "string")
            {
                this.destroy();
                break ;
            }
            this._sounds.set(
                key,
                scene.sound.add(key)
            );
        };
    }

    play(key: string, loop: boolean): void
    {
        const   sound: Phaser.Sound.BaseSound | undefined =
                        this._sounds.get(key);
   
        if (!sound)
            return ;
        sound.play({
            loop: loop
        });
        this._currentSounds.set(key, sound);
    }

    stop(key: string): void {
        const   sound: Phaser.Sound.BaseSound | undefined =
                    this._currentSounds.get(key);

        if (!sound)
            return ;
        if (sound.isPlaying || sound.isPaused)
        {
            sound.stop();
            this._currentSounds.delete(key);
        }
    }

}
