import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserEntity} from "../../user/user.entity";
import {MessageEntity} from "./message.entity";

@Entity({
    name : 'chats'
    }
)
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid')
    id : number;

    @CreateDateColumn()
    createdAt: Date;

    // @ManyToOne( () => UserEntity )
    // @JoinColumn( { name : 'userOne' } )
    // userOne : UserEntity;
    //
    // @ManyToOne( () => UserEntity )
    // @JoinColumn( { name : 'userTwo'} )
    // userTwo : UserEntity;

    @OneToMany( ()=> UserEntity, (users) => users.chats )
    @JoinColumn({name: "members" })
    users : UserEntity[];


    @OneToMany( (type) => MessageEntity, (messages) => messages.chat )
    @JoinColumn({ name: 'messages'})
    messages : MessageEntity[];
}
