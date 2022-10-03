import { UserEntity } from "src/user/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { CreateRoomDto } from "../dto/room.dto";

@Entity({ name: "room" })
export class RoomEntity {
    constructor(dto: CreateRoomDto) {
        this.room_id = dto.room_id;
        this.owner_user = dto.owner;
        this.password = dto.password;
        this.date = new Date();
    }

    @PrimaryColumn({
        type: "varchar",
        unique: true,
        length: 15,
    })
    readonly room_id: string;

    @Exclude()
    @Column({
        type: "varchar",
        nullable: true,
    })
    password: string;
    
    @BeforeInsert()
    async encryptPassword(): Promise<void> {
        if (this.password != undefined) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @Column({ type: Date })
    date: Date;

    @Column({ type: "varchar" })
    owner_user: string;

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