import { BaseEntity } from "src/common/classes/base.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { UserEntity } from "src/user/entity/user.entity";
import { 
    Column, 
    Entity, 
    Index, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { CreateBanDto } from "../dto/ban.dto";

@Entity({ name: 'ban' })
@Index(['userId', 'roomId'], { unique: true })
export class BanEntity extends BaseEntity {
    constructor(dto?: CreateBanDto) {
        super();
        if (dto !== undefined){
            Object.assign(this, dto);
        }
    }

    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column({
        type: 'bigint',
        name: 'user_id',
        update: false
    })
    userId: number;

    @ManyToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({
        type: 'number',
        name: 'room_id',
        update: false
    })
    roomId: number;

    @ManyToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'room_id' })
    room: RoomEntity;
}
