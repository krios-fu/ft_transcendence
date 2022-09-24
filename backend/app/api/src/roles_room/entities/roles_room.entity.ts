import { RolesEntity } from "src/roles/entities/roles.entity";
import { UsersRoomEntity } from "src/users_room/entities/users_room.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, TreeLevelColumn } from "typeorm";

@Entity({ name: 'roles_room' })
@Index(['user_room_id', 'role_id'], { unique: true })
export class RolesRoomEntity {
   constructor(
      user_room_id: number,
      role_id: string,
   ) {
      this.user_room_id = user_room_id;
      this.role_id = role_id;
      this.created = new Date;
   }
   
   @PrimaryGeneratedColumn('increment')
   id: number;

   @Column({
      type: 'bigint',
      update: false,
   })
   user_room_id: number;

   @ManyToOne(
      () => UsersRoomEntity,
      {
         cascade: true,
         eager: true,
      }
   )
   @JoinColumn( {name: 'user_in_room'})
   user_in_room: UsersRoomEntity;

   @Column({
      type: 'varchar',
      update: false,
   })
   role_id: string;

   @ManyToOne(
      () => RolesEntity,
      {
         cascade: true,
         eager: true,
      }
   )
   @JoinColumn( {name: 'role'} )
   role: string;

   @Column({
      type: 'date',
      update: false,
   })
   created: Date;
}