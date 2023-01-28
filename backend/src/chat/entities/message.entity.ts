import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {ChatEntity} from "./chat.entity";

@Entity({
    name : 'messages'
})
export class MessageEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({name: 'content'})
    content : string;

    @ManyToOne( () => UserEntity, (user) => user.messages , {
        eager : true,
    })
    // @JoinColumn({ name : 'author' } )
    author : UserEntity;

    @ManyToOne( () => ChatEntity, (chat)=> chat.messages,{
        // eager : true,
    })
    // @JoinColumn({ name : 'chatId' })
    chat : ChatEntity;
}
