import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserEntity} from "../../user/entities/user.entity";
import {ChatEntity} from "./chat.entity";

@Entity({
        name: 'membership'
    }
)

export class MembershipEntity{

    constructor( chat: ChatEntity, user : UserEntity){

        this.begin_at = new Date();
        this.user = user;
        this.chat = chat;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    begin_at: Date;

    @ManyToOne(()=> UserEntity, (user) => user.membership, {eager: true} )
    user : UserEntity;

    @ManyToOne(()=> ChatEntity, (chat)=> chat.membership)
    chat : ChatEntity;

}