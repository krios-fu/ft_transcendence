import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "roles" })
export class RolesEntity {
    @PrimaryColumn({
        type: "varchar",
        unique: true
    })
    readonly role: string
}