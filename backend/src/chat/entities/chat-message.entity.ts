import { BaseEntity } from "../../common/classes/base.entity";
import {Column, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
    JoinColumn} from "typeorm";
import { CreateChatMessageDto } from "../dtos/chat.dto";
import { ChatUserEntity } from "./chat-user.entity";

@Entity({
    name : 'chat_messages'
})
export class ChatMessageEntity extends BaseEntity {
    constructor(dto?: CreateChatMessageDto) {
		super();
		if (dto !== undefined) {
			Object.assign(this, dto);
		}
	}

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ name: 'content' })
    content : string;

    @Column({
        name: 'chat_user_id',
        type: 'bigint'
    })
    chatUserId: number;

    @ManyToOne(
        () => ChatUserEntity,
        (chatUser: ChatUserEntity) => chatUser.messages,
        { 
            eager: true,
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'chat_user_id' })
    chatUser: ChatUserEntity;

}
