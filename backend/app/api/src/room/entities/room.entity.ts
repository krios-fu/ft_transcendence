import { UserEntity } from "src/user/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import * as bcrypt from "bcrypt";

@Entity()
export class RoomEntity {
    @PrimaryColumn({
        type: "varchar",
        unique: true,
        length: 15,
    })
    readonly roomName: string;

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
        { cascade: ['remove'] }
    )
    @JoinColumn({ name: "owner_name" })
    owner: UserEntity;

    constructor(
        name: string,
        owner: UserEntity,
        password?: string,      
    ) {
        this.roomName = name;
        this.owner = owner;
        this.password = password;
        this.date = new Date();
    }
}