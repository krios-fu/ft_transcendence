import { UsersEntity } from "src/user/user.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
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
        () => UsersEntity, 
        { cascade: ['remove'] }
    )
    @JoinColumn({ name: "owner_name" })
    owner: UsersEntity;
}