import { BaseEntity } from "src/common/classes/base.entity";
import { RolesEntity } from "src/roles/entity/roles.entity";
import { UserRoomEntity } from "src/user_room/entity/user_room.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRoomRolesDto } from "../dto/user_room_roles.dto";

@Entity({ name: 'roles_room' })
@Index(['userRoomId', 'roleId'], { unique: true })
export class UserRoomRolesEntity extends BaseEntity {
   constructor(dto: UserRoomRolesDto) {
      super();
      if (dto !== undefined) {
         Object.assign(this, dto);
     }
   }

   @PrimaryGeneratedColumn('increment', { type: 'bigint' })
   id: number;

   @Column({
      type: 'bigint',
      name: 'user_room_id',
      update: false,
   })
   userRoomId: number;

   @ManyToOne(
      () => UserRoomEntity,
      {
         cascade: true,
         eager: true,
      }
   )
   @JoinColumn( {name: 'user_room_id'})
   userRoom: UserRoomEntity;

   @Column({
      type: 'bigint',
      name: 'role_id',
      update: false,
   })
   roleId: number;

   @ManyToOne(
      () => RolesEntity,
      {
         cascade: true,
         eager: true,
      }
   )
   @JoinColumn({ name: 'role' })
   role: string;
}