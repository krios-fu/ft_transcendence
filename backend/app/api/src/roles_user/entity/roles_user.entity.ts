
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'roles_user' })
export class RolesUserEntity {
    @Column({
        unique: true,
        type: 'bigint',
    })
    @Generated('increment')
    id: number;

    @PrimaryColumn({
        type: 'varchar',
    })
    user_id: string;

    @ManyToOne(
        () => UserEntity,
        { cascade: true },
    )
    @JoinColumn({ name: 'user' })
    user: UserEntity;

    @PrimaryColumn({
        type: 'varchar',
    })
    role_id: string;

    @ManyToOne(
        () => RolesEntity,
        { cascade: true },
    )
    @JoinColumn({ name: "role" })
    role: RolesEntity;

    @Column({
        type: Date,
    })
    date: Date;

    constructor(
        user: UserEntity,
        role: RolesEntity,
    ) {
        this.user = user;
        this.role = role;
        this.date = new Date;
    }
}
