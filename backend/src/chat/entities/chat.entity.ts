import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
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

    @OneToMany(()=> MembershipEntity, (members) => members.chat,
        {eager: true})
    membership : MembershipEntity[];

    @OneToMany(()=> MessageEntity, (messages)=> messages.chat,
        {eager: true})
    messages: MessageEntity[];
}
