import { Profile } from 'passport-42';
declare const FortyTwoStrategy_base: new (...args: any[]) => any;
export declare class FortyTwoStrategy extends FortyTwoStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile, callback: (err: any, payload: any) => void): Promise<any>;
}
export {};
