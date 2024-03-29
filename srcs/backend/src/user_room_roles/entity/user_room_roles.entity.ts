import { BaseEntity } from "../../common/classes/base.entity";
import { RolesEntity } from "../../roles/entity/roles.entity";
import { UserRoomEntity } from "../../user_room/entity/user_room.entity";
import { Column, 
   Entity, 
   Index, 
   JoinColumn, 
   ManyToOne, 
   PrimaryGeneratedColumn } from "typeorm";
import { UserRoomRolesDto } from "../dto/user_room_roles.dto";

@Entity({ name: 'user_room_roles' })
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
         eager: true,
         onDelete: 'CASCADE'
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
         eager: true,
         onDelete: 'CASCADE'
      }
   )
   @JoinColumn({ name: 'role_id' })
   role: RolesEntity;
}
