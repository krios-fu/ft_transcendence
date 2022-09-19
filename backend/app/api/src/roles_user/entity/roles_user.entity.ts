import { RolesEntity } from 'src/entity/roles.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'roles_user' })
export class RolesUserEntity {
    @Column({
        unique: true,
        type: 'bigint',
    })
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
}
