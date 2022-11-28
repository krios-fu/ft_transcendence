import { MessageEntity } from "./message.entity";
import { MembershipEntity } from "./membership.entity";
export declare class ChatEntity {
    id: number;
    begin_at: Date;
    membership: MembershipEntity[];
    messages: MessageEntity[];
}
