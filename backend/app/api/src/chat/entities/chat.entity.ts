import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
//import {MessageEntity} from "./message.entity";
import {UserEntity} from "../../user/user.entity";

@Entity({
    name : 'chats'
    }
)
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid')
    id : number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name : 'userOne' } )
    userOne : UserEntity;

    @ManyToOne( () => UserEntity )
    @JoinColumn( { name : 'userTwo'} )
    userTwo : UserEntity;

    /*@OneToMany( (type) => MessageEntity, (messages) => messages.chat )
    messages : MessageEntity[];*/
}
