import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {UserEntity} from "../../user/user.entity";
import {ChatEntity} from "./chat.entity";

@Entity({
        name: 'membership'
    }
)

export class MembershipEntity{
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @CreateDateColumn()
    begin_at: Date;

    @ManyToOne(()=> UserEntity, (user) => user.membership)
    user : UserEntity;

    @ManyToOne(()=> ChatEntity, (chat)=> chat.membership)
    chat : ChatEntity;

}