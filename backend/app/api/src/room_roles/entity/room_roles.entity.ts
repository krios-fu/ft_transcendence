import { Exclude } from "class-transformer";
import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateRoomRolesDto } from "../dto/room_roles.dto";
import * as bcrypt from "bcrypt";

@Entity({ name: 'room_role' })
@Index(['roomId', 'roleId'], { unique: true })
export class RoomRolesEntity {
    constructor(dto: CreateRoomRolesDto) {
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
        this.createdAt = new Date;
    }
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ 
        type: 'varchar',
        name: 'room_id'
    })
    roomId: number;

    @ManyToOne(
        () => RoomEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'room_id' })
    room: RoomEntity;

    @Column({ 
        type: 'varchar',
        name: 'role_id'
    })
    roleId: number;

    @ManyToOne(
        () => RolesEntity,
        {
            cascade: true,
            eager: true,
        }
    )
    @JoinColumn({ name: 'role_id' })
    role: RolesEntity;

    @Column({
        type: 'date',
        name: 'created_at'
    })
    createdAt: Date;

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
}
