import {
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
<<<<<<< HEAD
import {MessageEntity} from "./message.entity";
import { UserEntity } from "../../user/entities/user.entity";
=======
import { ChatUserEntity } from "./chat-user.entity";
>>>>>>> main

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
            onDelete: 'CASCADE',
            cascade: true,
            eager: true
        }
    )
    users: ChatUserEntity[];
}
