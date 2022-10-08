import { Column, Entity, PrimaryColumn } from "typeorm";
import { CreateRoleDto } from "../dto/role.dto";

@Entity({ name: "roles" })
export class RolesEntity {
    constructor( dto: CreateRoleDto ) {
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
        this.createdAt = new Date;
    }

    @PrimaryColumn({ type: 'varchar' })
    readonly role: string

    @Column({ 
        type: 'date',
        name: 'created_at',
    })
    createdAt: Date;
}