import { Socket } from "socket.io-client";
import { Hero } from "../elements/Hero";
import { BaseScene } from "./BaseScene";

interface   IMenuData {
    //PlayerA, PlayerB, Spectator
    role: string;
    nickA: string;
    nickB: string;
}

enum    SelectionStatus {
    Hero,
    Stage,
    Finish
}

export class    MenuScene extends BaseScene {

    role?: string;
    nickA?: string;
    nickB?: string;
    status: SelectionStatus;
    selection?: any;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    enter?: any; //Enter key

    constructor(sock: Socket, room: string) {
        super("Menu", sock, room);
        this.status = SelectionStatus.Hero;
    }

    init(initData: IMenuData) {
        this.role = initData.role;
        this.nickA = initData.nickA;
        this.nickB = initData.nickB;
    }

    preload() {
        //load hero selection images
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        this.enter = this.input.keyboard.addKey("ENTER");
        //Create Hero and Stage images
        this.cursors.left.on('down', () => {
            // Next selection to the left
            if (this.role != "Spectator")
            {
                if (this.status === SelectionStatus.Finish)
                    return ;
                this.socket.emit("leftSelection");
                if (this.status === SelectionStatus.Hero)
                    //Call HeroSelector
                else
                    //Call StageSelector
            }
        });
        this.cursors.right.on('down', () => {
            // Next selection to the right
            if (this.role != "Spectator")
            {
                if (this.status === SelectionStatus.Finish)
                    return ;
                this.socket.emit("rightSelection");
                if (this.status === SelectionStatus.Hero)
                    //Call HeroSelector
                else
                    //Call StageSelector
            }
        });
        this.enter.on('down', () => {
            //Confirm selection
            if (this.role != "Spectator")
            {
                if (this.status === SelectionStatus.Finish)
                    return ;
                this.socket.emit("confirmSelection")
                if (this.status === SelectionStatus.Hero)
                    //Call HeroSelector
                else
                    //Call StageSelector
            }
        });
    }

}
