import { Injectable } from "@angular/core";
import { IMatchInitData } from "../elements/Match";
import { IResultData } from "../elements/Result";
import { BaseScene } from "../scenes/BaseScene";
import { EndScene } from "../scenes/EndScene";
import { MatchScene } from "../scenes/MatchScene";
import { MenuHeroScene } from "../scenes/MenuHeroScene";
import { MenuScene } from "../scenes/MenuScene";
import { StartScene } from "../scenes/StartScene";
import {
    GameRole,
    IMatchSceneInit,
    IMenuInit
} from "../interfaces/scene.interfaces";

export type SceneId = "start"
                        | "menuClassic"
                        | "menuHero"
                        | "match"
                        | "end";

export interface    IRecoverData {
    readonly scene: SceneId;
    readonly data: Readonly<IResultData | IMenuInit | IMatchRecoveryData>
}

export interface   IMatchRecoveryData {
    role: GameRole;
    matchData: IMatchInitData;
}

@Injectable({
    providedIn: "root"
})
export class    GameRecoveryService {

    constructor() {}

    private _sceneTransition(scene: BaseScene, recData: IRecoverData): void {
        let data: IResultData | IMenuInit | IMatchRecoveryData;

        if (recData.scene === "start")
        {
            scene.scene.start("Start");
        }
        else if (recData.scene === "end")
        {
            scene.scene.start("End", recData.data as IResultData);
        }
        else if (recData.scene === "menuClassic"
                || recData.scene === "menuHero")
        {
            data = recData.data as IMenuInit;
            if (data.selection.heroA != undefined)
                scene.scene.start("MenuHero", data);
            else
                scene.scene.start("Menu", data);
        }
        else if (recData.scene === "match")
        {
            data = recData.data as IMatchRecoveryData;
            if (data.role === "Spectator")
            {
                scene.scene.start("Spectator", {
                    role: data.role,
                    matchData: data.matchData,
                    recover: true
                } as IMatchSceneInit);
            }
            else
            {
                if (data.matchData.playerA.hero)
                {
                    scene.scene.start("Player", {
                        role: data.role,
                        matchData: data.matchData,
                        recover: true
                    } as IMatchSceneInit);
                }
                else
                {
                    scene.scene.start("ClassicPlayer", {
                        role: data.role,
                        matchData: data.matchData,
                        recover: true
                    } as IMatchSceneInit);
                }
            }
        }
    }

    setUp(scene: StartScene
                    | EndScene | MenuScene
                    | MenuHeroScene | MatchScene): void {
        scene.socket.on("recoverData", (recData: IRecoverData) => {
            if (recData.scene === "start" && scene instanceof StartScene)
            {
                scene.recover(undefined);
                return ;
            }
            else if (recData.scene === "end" && scene instanceof EndScene)
            {
                scene.recover(recData.data as IResultData);
                return ;
            }
            else if (
                (recData.scene === "menuHero" && scene instanceof MenuHeroScene)
                    || (recData.scene === "menuClassic"
                            && scene instanceof MenuScene)
            )
            {
                scene.recover(recData.data as IMenuInit);
                return ;
            }
            else if (recData.scene === "match" && scene instanceof MatchScene)
            {
                scene.recover(recData.data as IMatchRecoveryData);
                return ;
            }
            scene.destroy();
            this._sceneTransition(scene, recData);
        });
    }

}
