import {Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MessageEntity} from "./message.entity";

@Entity()
export class ChatEntity {
    @PrimaryGeneratedColumn('uuid')
    id : number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany( (type) => MessageEntity, (messages) => messages.chat )
    messages : MessageEntity[];
}
