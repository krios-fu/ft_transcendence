import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { ChatUserEntity } from "./chat-user.entity";

@Entity({
    name : 'chats'
    }
)
export class ChatEntity {
    constructor (){
        this.begin_at = new Date();
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    begin_at: Date;

    @OneToMany(
        ()=> ChatUserEntity, 
        (chatUser: ChatUserEntity) => chatUser.chat,
        { 
            onCascade: 'DELETE',
            cascade: true
        }
    )
    users: ChatUserEntity[];
}
