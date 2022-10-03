
import { RolesEntity } from 'src/roles/entity/roles.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateUserRolesDto } from '../dto/user_roles.dto';

@Entity({ name: 'roles_user' })
export class UserRolesEntity {
    constructor (dto: CreateUserRolesDto) {
        this.user_id = dto.user_id;
        this.role_id = dto.role_id;
        this.date = new Date;
    }

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
}
