import { RolesEntity } from "src/roles/entities/roles.entity";
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'roles_room' })
export class RolesRoomEntity {
   @PrimaryGeneratedColumn('increment')
   id: number;

   
}