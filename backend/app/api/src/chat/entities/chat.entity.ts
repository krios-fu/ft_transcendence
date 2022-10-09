import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserEntity} from "../../user/user.entity";
import {MessageEntity} from "./message.entity";
import {MembershipEntity} from "./membership.entity";

@Entity({
    name : 'chats'
    }
)
export class ChatEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @CreateDateColumn()
    begin_at: Date;

    @OneToMany(()=> MembershipEntity, (members) => members.chat)
    membership : MembershipEntity[];

    @OneToMany(()=> MessageEntity, (messages)=> messages.chat)
    messages: MessageEntity[];
}
