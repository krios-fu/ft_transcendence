import { UserEntity } from "../../user/user.entity";
import { ChatEntity } from "./chat.entity";
export declare class MembershipEntity {
    id: number;
    begin_at: Date;
    user: UserEntity;
    chat: ChatEntity;
}
