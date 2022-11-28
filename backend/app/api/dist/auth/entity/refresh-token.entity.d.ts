import { UserEntity } from "src/user/user.entity";
export interface RefreshTokenOptions {
    authUser: UserEntity;
    expiresIn: Date;
}
export declare class RefreshTokenEntity {
    token: string;
    authUser: UserEntity;
    expiresIn: Date;
    constructor(refreshToken?: RefreshTokenOptions);
}
