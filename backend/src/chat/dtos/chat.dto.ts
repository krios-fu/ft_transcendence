import {MembershipEntity} from "../entities/membership.entity";
import {MessageEntity} from "../entities/message.entity";

export class ChatDto {
    id?: number;
    begin_at: Date;
    membership?: MembershipEntity[];
    messages?: MessageEntity[];
}
