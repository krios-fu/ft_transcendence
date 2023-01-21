import { Exclude } from "class-transformer";
import { RolesEntity } from "src/roles/entity/roles.entity";
import { RoomEntity } from "src/room/entity/room.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateRoomRolesDto } from "../dto/room_roles.dto";
import * as bcrypt from "bcrypt";
import { BaseEntity } from "src/common/classes/base.entity";
import { InternalServerErrorException } from "@nestjs/common";

@Entity({ name: 'room_role' })
@Index(['roomId', 'roleId'], { unique: true })
export class RoomRolesEntity extends BaseEntity {
    constructor(dto: CreateRoomRolesDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ 
        type: 'bigint',
        name: 'room_id',
        update: false
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
        type: 'bigint',
        name: 'role_id',
        update: false

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

    @Exclude()
    @Column({
        type: "varchar",
        nullable: true,
    })
    password?: string;
    
    @BeforeInsert()
    @BeforeUpdate()
    async encryptPassword(): Promise<void> {
        if (this.password != undefined) {
            const salt = await bcrypt.genSalt();
            try {
                this.password = await bcrypt.hash(this.password, salt);
            } catch (e) {
                throw new InternalServerErrorException('kernel panic');
            }
        }
    }
}
