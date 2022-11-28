import { UserEntity } from "src/user/user.entity";
export declare class RoomEntity {
    readonly name: string;
    password: string;
    encryptPassword(): Promise<void>;
    date: Date;
    owner: UserEntity;
    constructor(name: string, owner: UserEntity, password?: string);
}
