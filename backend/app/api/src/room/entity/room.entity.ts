import { UserEntity } from "src/user/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

@Entity({ name: "room" })
export class RoomEntity {
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

    @ManyToOne(
        () => UserEntity, 
        { 
            cascade: true,
            eager: true
        }
    )
    @JoinColumn({ name: "owner_user" })
    owner: UserEntity;

    constructor(
        room_id: string,
        owner: UserEntity,
        password?: string,      
    ) {
        this.room_id = room_id;
        this.owner = owner;
        this.password = password;
        this.date = new Date();
    }
}