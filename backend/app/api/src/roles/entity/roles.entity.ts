import { Entity, PrimaryColumn } from "typeorm";
import { CreateRoleDto } from "../dto/role.dto";

@Entity({ name: "roles" })
export class RolesEntity {
    constructor( dto: CreateRoleDto ) {
        this.role = dto.role;
    }

    @PrimaryColumn({
        type: "varchar",
        unique: true
    })
    readonly role: string
}