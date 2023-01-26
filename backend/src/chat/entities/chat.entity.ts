import {
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {MessageEntity} from "./message.entity";
import { UserEntity } from "../../user/entities/user.entity";

@Entity({
    name : 'chats'
    }
)
export class ChatEntity {
    constructor (){
        this.begin_at = new Date();
    }
    
    @PrimaryGeneratedColumn()
    id : number;

    @CreateDateColumn()
    begin_at: Date;

    @ManyToMany(()=> UserEntity, (user) => user.chats, {
        eager: true,
    })
    @JoinTable()
    users: UserEntity[];

    // @OneToMany(()=> MembershipEntity, (members) => members.chat)
    // @JoinTable()
    // membership : MembershipEntity[];

    @OneToMany(()=> MessageEntity, (messages)=> messages.chat)
    @JoinTable()
    messages: MessageEntity[];
}
