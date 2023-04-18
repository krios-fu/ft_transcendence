import { RolesEntity } from '../../roles/entity/roles.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { 
    BaseEntity, 
    Column, 
    Entity, 
    Generated, 
    Index, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from 'typeorm';
import { CreateUserRolesDto } from '../dto/user_roles.dto';

@Entity({ name: 'user_roles' })
@Index(['roleId', 'userId'], { unique: true })
export class UserRolesEntity extends BaseEntity {
    constructor (dto: CreateUserRolesDto) {
        super();
        if (dto !== undefined) {
            Object.assign(this, dto);
        }
    }

    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    @Generated('increment')
    id: number;

    @Column({
        type: 'bigint',
        name: 'user_id'
    })
    userId: number;

    @ManyToOne(
        () => UserEntity,
        {
            /*cascade: true,*/
            onDelete: 'CASCADE'
        },
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({
        type: 'bigint',
        name: 'role_id'
    })
    roleId: number;

    @ManyToOne(
        () => RolesEntity,
        {
            /*cascade: true,*/
            onDelete: 'CASCADE'
        },
    )
    @JoinColumn({ name: "role_id" })
    role: RolesEntity;
}
