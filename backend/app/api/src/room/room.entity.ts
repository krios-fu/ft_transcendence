/* import { UsersEntity } from "src/users/users.entity";
import { BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import * as bcrypt from "bcrypt";

scope adecuado ?? 
export class IsPrivate {
    isPrivate: boolean;
    password?: string;
};

 Parámetros de configuración de columna: 
    type,     name,         length,        width,      onUpdate,
    nullable, update,       insert,        select,     default,
    primary,  unique,       comment,       precision,  scale, 
    zerofill, unisgned,     charset,       collation,  enum, 
    enumName, asExpression, generatedType, hstoreType, array,
    transformer

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
    async encryptPassword() {
        if (this.password != undefined) {
            const salt = await bcrypt.genSalt();
        }
    }

    @Column({
        type: Date,
    })
    date: Date;

    @OneToMany(
        () => UsersEntity
//        (usersEntity) => usersEntity.owner
    )
    @JoinColumn()
    owner: UsersEntity;


    @OneToMany(
        () => OwnerEntity,
        (ownerEntity) => ownerEntity,room_id
    )
    owner: OwnerEntity;
}
 */
