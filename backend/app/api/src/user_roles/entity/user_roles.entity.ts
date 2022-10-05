
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateUserRolesDto } from '../dto/user_roles.dto';

@Entity({ name: 'roles_user' })
@Index(['roleId', 'userId'], { unique: true })
export class UserRolesEntity {
    constructor (dto: CreateUserRolesDto) {
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
        this.createdAt = new Date;
    }

    @Column({
        unique: true,
        type: 'bigint',
    })
    @Generated('increment')
    id: number;

    @PrimaryColumn({
        type: 'varchar',
        name: 'user_id'
    })
    userId: string;

    @ManyToOne(
        () => UserEntity,
        { cascade: true },
    )
    @JoinColumn({ name: 'user' })
    user: UserEntity;

    @PrimaryColumn({
        type: 'varchar',
        name: 'role_id'
    })
    roleId: string;

    @ManyToOne(
        () => RolesEntity,
        { cascade: true },
    )
    @JoinColumn({ name: "role" })
    role: RolesEntity;

    @Column({
        type: 'date',
        name: 'created_at'
    })
    createdAt: Date;
}
