import { HeroId } from "./GameSelection";
import { Hero } from "./Hero";
export declare class HeroCreator {
    private _gameWidth;
    private _gameHeight;
    constructor(gameWidth: number, gameHeight: number);
    private aquamanSprite;
    private aquaman;
    private supermanSprite;
    private superman;
    private blackPantherSprite;
    private blackPanther;
    create(heroId: HeroId, playerSide: number): Hero;
}
