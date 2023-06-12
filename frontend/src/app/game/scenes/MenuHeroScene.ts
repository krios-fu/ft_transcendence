import { Socket } from "socket.io-client";
import { IMatchInitData } from "../elements/Match";
import { MenuHeroRenderer } from "../elements/MenuHeroRenderer";
import { MenuSelector } from "../elements/MenuSelector";
import { GameRecoveryService } from "../services/recovery.service";
import {
    SelectionSoundKeys,
    SoundService
} from "../services/sound.service";
import { MenuScene } from "./MenuScene";
import {
    IMenuInit,
    ISelectionData
} from "../interfaces/scene.interfaces";

export class    MenuHeroScene extends MenuScene {

    private _menuHeroRenderer?: MenuHeroRenderer;

    selector?: MenuSelector;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    enter?: any; //Enter key

    constructor(sock: Socket,
                    private readonly soundService: SoundService,
                    override readonly recoveryService: GameRecoveryService) {
        super(sock, recoveryService, "MenuHero");
    }

    /*
    **  If this.initData is not undefined means service recovery assigned
    **  an updated value to this.initData first, and must not be reassigned.
    */
    override init(initData: IMenuInit) {
        if (!this.initData)
        {
            this.role = initData.role;
            this.initData = initData.selection;
        }
        this.socket.once("startMatch", (gameData: IMatchInitData) => {
            this.destroy();
            if (this.role != "Spectator")
            {
                this.scene.start("Player", {
                    role: this.role,
                    matchData: gameData
                });
            }
            else
            {
                this.scene.start(this.role, {
                    role: this.role,
                    matchData: gameData
                });
            }
        });
        this.socket.once("end", (data) => {
            this.destroy();
            this.scene.start("End", data);
        });
        this.recoveryService.setUp(this);
    }

    override preload() {
        const   selectSounds: SelectionSoundKeys =
                                SoundService.selectionSoundKeys;
        
        super.preload();
        this.load.image('aquamanMenu', '/assets/aquaman_menu.jpg');
        this.load.image('supermanMenu', '/assets/superman_menu.jpg');
        this.load.image('blackPantherMenu', '/assets/blackPanther_menu.jpeg');
        this.load.image('aquamanConfirm', '/assets/aquaman_menu_confirm.png');
        this.load.image('supermanConfirm', '/assets/superman_menu_confirm.jpg');
        this.load.image('blackPantherConfirm',
                            '/assets/blackPanther_menu_confirm.jpeg');
        this.load.image('atlantisMenu', '/assets/atlantis_menu.jpeg');
        this.load.image('metropolisMenu', '/assets/metropolis_menu.jpeg');
        this.load.image('wakandaMenu', '/assets/wakanda_menu.jpg');
        this.load.image('atlantisConfirm', '/assets/atlantis_menu_confirm.jpeg');
        this.load.image('metropolisConfirm', '/assets/metropolis_menu_confirm.jpeg');
        this.load.image('wakandaConfirm', '/assets/wakanda_menu_confirm.jpg');
        this.load.audio(selectSounds.theme, '/assets/selection_theme.mp3');
        this.load.audio(selectSounds.change, '/assets/selection_change.mp3');
        this.load.audio(selectSounds.confirm, '/assets/selection_confirm.mp3');
        this.load.audio(selectSounds.finish, '/assets/selection_finish.mp3');
    }

    override create() {
        if (!this.initData)
            return ;
        this.soundService.load(this, SoundService.selectionSoundKeys);
        this._menuHeroRenderer = new MenuHeroRenderer(
            this,
            this.initData,
            this.soundService
        );
        this.selector = new MenuSelector(this.initData, this._menuHeroRenderer);
        this.socket.on("leftSelection", (data: ISelectionData) => {
            this.selector?.serverUpdate(data);
        });
        this.socket.on("rightSelection", (data: ISelectionData) => {
            this.selector?.serverUpdate(data);
        });
        this.socket.on("confirmSelection", (data: ISelectionData) => {
            this.selector?.serverUpdate(data, this.role);
        });
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        this.enter = this.input.keyboard.addKey("ENTER");
        this.cursors.left.on('down', () => {
            // Next selection to the left
            if (this.role != "Spectator")
            {
                if (this.selector?.finished)
                    return ;
                this.socket.emit("leftSelection");
                this.selector?.nextLeft(this.role);
            }
        });
        this.cursors.right.on('down', () => {
            // Next selection to the right
            if (this.role != "Spectator")
            {
                if (this.selector?.finished)
                    return ;
                this.socket.emit("rightSelection");
                this.selector?.nextRight(this.role);
            }
        });
        this.enter.on('down', () => {
            //Confirm selection
            if (this.role != "Spectator")
            {
                if (this.selector?.finished)
                    return ;
                this.socket.emit("confirmSelection")
                this.selector?.confirm(this.role);
            }
        });
    }

    override destroy(): void {
        super.destroy();
        if (this._menuHeroRenderer)
        {
            this._menuHeroRenderer.destroy();
            delete this._menuHeroRenderer;
        }
        this.soundService.destroy();
        this.initData = undefined;
    }

    override recover(data: IMenuInit): void {
        this.role = data.role;
        this.initData = data.selection;
        /*
        **  This can be improved checking if it is necessary
        **  to reset the scene, update some values, or do nothing.
        */
        if (!this._menuHeroRenderer)
            return ;
        this._menuHeroRenderer.destroy();
        this._menuHeroRenderer = new MenuHeroRenderer(
            this,
            this.initData,
            this.soundService
        );
        this.selector = new MenuSelector(this.initData, this._menuHeroRenderer);
    }

}
