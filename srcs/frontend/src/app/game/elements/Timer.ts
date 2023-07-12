import { BaseScene } from "../scenes/BaseScene";
import { Txt } from "./Txt";

export class    Timer {

    private _clockTxt: Txt;
    private _clockIntervalId: number | undefined;
    private _timeoutDate: number;

    constructor(scene: BaseScene, xPos: number, yPos: number,
                    timeoutDate: number) {
        this._clockTxt = new Txt(scene, {
            xPos: xPos,
            yPos: yPos,
            content: "--:--",
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
        this._timeoutDate = timeoutDate;
        this._clockIntervalId = this._setClockInterval()
    }

    private _setClockInterval(): number {
        return (
            window.setInterval(() => {
                let diff: number = this._timeoutDate - Date.now();
                let min: number;
                let sec: number;

                if (diff <= 0)
                {
                    this._clockTxt.content = "00:00";
                    window.clearInterval(this._clockIntervalId);
                    return ;
                }
                min = (diff / 1000) / 60;
                sec = (min - Math.floor(min)) * 60;
                this._clockTxt.content =
                    `${String(Math.floor(min)).padStart(2, '0')}`
                    + ':'
                    + `${String(Math.floor(sec)).padStart(2, '0')}`;
            }, 1000)
        );
    }

    private _clearClockInterval(): void {
        if (!this._clockIntervalId)
            return ;
        window.clearInterval(this._clockIntervalId);
        this._clockIntervalId = undefined;
    }

    destroy(): void {
        this._clearClockInterval();
        this._clockTxt.destroy();
    }

}
