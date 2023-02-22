import { Injectable } from "@angular/core";
import { IMatchInitData } from "../elements/Match";
import { IResultData } from "../elements/Result";
import { BaseScene } from "../scenes/BaseScene";
import { EndScene } from "../scenes/EndScene";
import { MatchScene } from "../scenes/MatchScene";
import { MenuHeroScene } from "../scenes/MenuHeroScene";
import {
    IMenuInit,
    MenuScene
} from "../scenes/MenuScene";
import { StartScene } from "../scenes/StartScene";

export type SceneId = "start"
                        | "menuClassic"
                        | "menuHero"
                        | "match"
                        | "end";

export interface    IRecoverData {
    readonly scene: SceneId;
    readonly data: Readonly<IResultData | IMenuInit | IMatchInitData>
}

@Injectable({
    providedIn: "root"
})
export class    GameRecoveryService {

    constructor() {}

    private _sceneTransition(scene: BaseScene, recData: IRecoverData): void {
        let data: IResultData | IMenuInit | IMatchInitData;

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
            if (data.hero)
                scene.scene.start("MenuHero", data);
            else
                scene.scene.start("Menu", data);
        }
        else if (recData.scene === "match")
        { // Improve!! There might be a case where role is not "Spectator"
            data = recData.data as IMatchInitData;
            scene.scene.start("Spectator", {
                role: "Spectator",
                matchData: data
            });
        }
    }

    setUp(scene: StartScene
                    | EndScene | MenuScene
                    | MenuHeroScene | MatchScene): void {
        scene.setUpRecovery();
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
                scene.recover(recData.data as IMatchInitData);
                return ;
            }
            scene.destroy();
            this._sceneTransition(scene, recData);
        });
    }

}
