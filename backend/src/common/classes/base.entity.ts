import { Exclude } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}