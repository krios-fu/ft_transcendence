import { BaseEntity } from "src/common/classes/base.entity";
import { RoomRolesEntity } from "src/room_roles/entity/room_roles.entity";
import { UserRolesEntity } from "src/user_roles/entity/user_roles.entity";
import { UserRoomRolesEntity } from "src/user_room_roles/entity/user_room_roles.entity";
import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn,
    OneToMany 
} from "typeorm";
import { CreateRoleDto } from "../dto/role.dto";

@Entity({ name: "roles" })
export class RolesEntity extends BaseEntity {
    constructor(dto: CreateRoleDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column({ 
        type:  'varchar',
        unique: true,
        length: 15
     })
    role!: string

    @OneToMany(() => UserRoomRolesEntity, (userRoomRoles) => userRoomRoles.role)
    userRoomRole: UserRoomRolesEntity;

    @OneToMany(() => UserRolesEntity, (userRole) => userRole.role)
    userRole: UserRolesEntity[];

    @OneToMany(() => RoomRolesEntity, (roomRole) => roomRole.role)
    roomRole: RoomRolesEntity[];
}