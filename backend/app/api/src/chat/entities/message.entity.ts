import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {UserEntity} from "../../user/user.entity";
import {ChatEntity} from "./chat.entity";

@Entity({
    name : 'messages'
})
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
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
