import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user/user.entity";
import {ChatEntity} from "./chat.entity";

@Entity()
export class MessageEntity {
    @PrimaryGeneratedColumn('uuid')
    id : number;

    @Column()
    text : string;

    @ManyToOne( (type) => UserEntity, (user) => user.messages , {
        cascade : true,
    })
    user : UserEntity;

    @ManyToOne( (type) => ChatEntity, (chat) => chat.messages , {
        cascade : true,
    })
    chat : ChatEntity;
}
