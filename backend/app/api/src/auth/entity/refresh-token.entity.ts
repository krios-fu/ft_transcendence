import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    @JoinColumn({ name: 'token_user' })
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
