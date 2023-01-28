import { BaseEntity } from "../../common/classes/base.entity";
import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn
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
     })
    role!: string
}