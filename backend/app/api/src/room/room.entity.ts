import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { PrimaryGeneratedColumnIdentityOptions } from "typeorm/decorator/options/PrimaryGeneratedColumnIdentityOptions";

@Entity()
export class RoomEntity {
    @PrimaryColumn({
        length: 15,
    })
    roomName: string;

//    @Column({
//        type: Date,
//    })
//    date: Date;

    @ManyToMany(
        () => UsersEntity, 
        (usersEntity) => usersEntity.rooms
        )
    @JoinTable()
    users: UsersEntity[];



    //@Column()
    //queuedUsers: QueuedUserEntity;

    //@Column()
    //bannedUsers: BannedUserEntity;

    //@Column()
    //admins: AdminEntity;

    //@Column()
    //silencedUsers: SilencedUserEntity;
    /* ???
    @Column()
    chat: ChatEntity;

    @Column()
    game: GameEntity;
    *  *** */

    //@ManyToMany(() => UserEntity)
}
