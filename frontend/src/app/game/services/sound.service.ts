import { Injectable } from "@angular/core";

export interface   SelectionSoundKeys {
    readonly change: string;
    readonly confirm: string;
    readonly finish: string;
    readonly theme: string;
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
