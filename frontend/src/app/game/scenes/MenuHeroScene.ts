import { Socket } from "socket.io-client";
import { IMatchInitData } from "../elements/Match";
import { MenuHeroRenderer } from "../elements/MenuHeroRenderer";
import { MenuSelector } from "../elements/MenuSelector";
import {
    IMenuInit,
    ISelectionData,
    MenuScene
} from "./MenuScene";

export class    MenuHeroScene extends MenuScene {

    private _menuHeroRenderer?: MenuHeroRenderer;

    selector?: MenuSelector;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    enter?: any; //Enter key

    constructor(sock: Socket, room: string) {
        super(sock, room, "MenuHero");
    }

    override init(initData: IMenuInit) {
        this.role = initData.role;
        this.initData = initData.selection;
        this.socket.once("startMatch", (gameData: IMatchInitData) => {
            if (this._menuHeroRenderer)
                this._menuHeroRenderer.destroy();
            this.removeAllSocketListeners();
            if (this.role != "Spectator")
                this.scene.start("Player", gameData);
            else
                this.scene.start(this.role, gameData);
        });
        this.socket.once("end", (data) => {
            if (this._menuHeroRenderer)
                this._menuHeroRenderer.destroy();
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
    }

    override preload() {
        super.preload();
        this.load.image('aquamanMenu', '/assets/aquaman_menu.jpg');
        this.load.image('supermanMenu', '/assets/superman_menu.jpg');
        this.load.image('blackPantherMenu', '/assets/blackPanther_menu.jpeg');
        this.load.image('aquamanConfirm', '/assets/aquaman_menu.jpg');
        this.load.image('supermanConfirm', '/assets/superman_menu.jpg');
        this.load.image('blackPantherConfirm', '/assets/blackPanther_menu.jpeg');
        this.load.image('atlantisMenu', '/assets/atlantis_menu.jpeg');
        this.load.image('metropolisMenu', '/assets/metropolis_menu.jpeg');
        this.load.image('wakandaMenu', '/assets/wakanda_menu.png');
    }

    override create() {
        if (!this.initData)
            return ;
        this._menuHeroRenderer = new MenuHeroRenderer(
            this,
            this.initData
        );
        this.selector = new MenuSelector(this.initData, this._menuHeroRenderer);
        this.socket.on("leftSelection", (data: ISelectionData) => {
            this.selector?.serverUpdate(data);
        });
        this.socket.on("rightSelection", (data: ISelectionData) => {
            this.selector?.serverUpdate(data);
        });
        this.socket.on("confirmSelection", (data: ISelectionData) => {
            this.selector?.serverUpdate(data);
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

}
