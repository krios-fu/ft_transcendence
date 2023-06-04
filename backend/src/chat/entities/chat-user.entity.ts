import { BaseEntity } from '../../common/classes/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { 
    Entity, 
    Index,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Column } from 'typeorm';
import { CreateChatUserDto } from '../dtos/chat-user.dto';
import { ChatMessageEntity } from './chat-message.entity';
import { ChatEntity } from './chat.entity';

@Entity({ name: 'chat_user' })
@Index(['chatId', 'userId'], {unique: true})
export class ChatUserEntity extends BaseEntity {
    constructor (dto: CreateChatUserDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }

    @PrimaryGeneratedColumn(
        'increment',
        {type: 'bigint'}
    )
    id: number;

    @Column({
        type: 'bigint',
        name: 'chat_id',
        update: false
    })
    chatId: number;

    @ManyToOne(
        () => ChatEntity,
        (chat: ChatEntity) => chat.users,
        { onDelete: 'CASCADE' }
        // { eager: true }
    )
    @JoinColumn({ name: 'chat_id' })
    chat: ChatEntity;
    
    @Column({
        type: 'bigint',
        name: 'user_id',
        update: false
    })
    userId: number;

    @ManyToOne(
        () => UserEntity,
        (user: UserEntity) => user.chats,
        { 
            eager: true,
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @OneToMany(
        () => ChatMessageEntity,
        (message: ChatMessageEntity) => message.chatUser,
        {
            onDelete: 'CASCADE',
            cascade: true
        }
    )
    messages: ChatMessageEntity[];
}
