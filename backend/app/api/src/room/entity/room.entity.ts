import { UserEntity } from "src/user/user.entity";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { CreateRoomDto } from "../dto/room.dto";
import { 
    BeforeInsert, 
    Column, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryColumn 
} from "typeorm";

@Entity({ name: "room" })
export class RoomEntity {
    constructor(dto: CreateRoomDto) {
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
        this.createdAt = new Date();
    }

    @PrimaryColumn({
        type: 'varchar',
        name: 'room_id',
        unique: true,
        length: 15,
    })
    roomId!: string;

    @Exclude()
    @Column({
        type: "varchar",
        nullable: true,
    })
    password?: string;
    
    @BeforeInsert()
    async encryptPassword(): Promise<void> {
        if (this.password != undefined) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @Column({ 
        type: 'date' ,
        name: 'created_at'
    })
    createdAt: Date;

    @Column({ 
        type: 'varchar',
        name: 'owner_user'
    })
    ownerUser!: string;

    @ManyToOne(
        () => UserEntity, 
        { 
            cascade: true,
            eager: true
        }
    )
    @JoinColumn({ name: "owner_user" })
    owner: UserEntity;
}