
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { BaseEntity, Column, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateUserRolesDto } from '../dto/user_roles.dto';

@Entity({ name: 'roles_user' })
@Index(['roleId', 'userId'], { unique: true })
export class UserRolesEntity extends BaseEntity {
    constructor (dto: CreateUserRolesDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }

    @Column({
        unique: true,
        type: 'bigint',
    })
    @Generated('increment')
    id: number;

    @PrimaryColumn({
        type: 'bigint',
        name: 'user_id'
    })
    userId: number;

    @ManyToOne(
        () => UserEntity,
        { cascade: true },
    )
    @JoinColumn({ name: 'user' })
    user: UserEntity;

    @PrimaryColumn({
        type: 'bigint',
        name: 'role_id'
    })
    roleId: number;

    @ManyToOne(
        () => RolesEntity,
        { cascade: true },
    )
    @JoinColumn({ name: "role" })
    role: RolesEntity;
}
