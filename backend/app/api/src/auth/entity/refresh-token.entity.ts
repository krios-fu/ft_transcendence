import { UserEntity } from "src/user/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'refreshToken' })
export class RefreshTokenEntity {
    @PrimaryGeneratedColumn('uuid')
    token: string;

    @OneToOne(
        () => UserEntity, 
        {
            cascade: true,
        }
    )
    authUser: UserEntity;

    @Column({
        type: Date,
    })
    expiresIn: Date;

    constructor(
        authUser: UserEntity,
        expiresIn: Date,
    ) {
        this.authUser = authUser;
        this.expiresIn = expiresIn;
    }
}
