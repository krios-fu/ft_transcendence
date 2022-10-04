import { RolesEntity } from "src/roles/entity/roles.entity";
import { UserRoomEntity } from "src/user_room/entity/user_room.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateUserRoomRolesDto } from "../dto/user_room_roles.dto";

@Entity({ name: 'roles_room' })
@Index(['user_room_id', 'role_id'], { unique: true })
export class UserRoomRolesEntity {
   constructor(dto: CreateUserRoomRolesDto) {
      this.user_room_id = dto.user_room_id;
      this.role_id = dto.role_id;
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
      () => UserRoomEntity,
      {
         cascade: true,
         eager: true,
      }
   )
   @JoinColumn( {name: 'user_in_room'}) /* ??? */
   user_in_room: UserRoomEntity;

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
   @JoinColumn({ name: 'role' })
   role: string;

   @Column({
      type: 'date',
      update: false,
   })
   created: Date;
}