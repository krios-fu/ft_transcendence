import { MessageEntity } from "../chat/entities/message.entity";
import { MembershipEntity } from "../chat/entities/membership.entity";
export declare enum Category {
    Pending = 0,
    Iron = 1,
    Bronze = 2,
    Silver = 3,
    Gold = 4,
    Platinum = 5
}
export declare class UserEntity {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    photoUrl: string;
    profileUrl: string;
    nickName: string;
    doubleAuth: boolean;
    ranking: number;
    category: Category;
    creationDate: Date;
    lastConnection: Date;
    messages: MessageEntity[];
    membership: MembershipEntity[];
}
