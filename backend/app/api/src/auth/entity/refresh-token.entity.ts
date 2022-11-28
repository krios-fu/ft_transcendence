import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export interface RefreshTokenOptions {
    authUser: UserEntity;
    expiresIn: Date;
}

@Entity({ name: 'refresh_token' })
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

    constructor(refreshToken?: RefreshTokenOptions) {
        if (refreshToken != undefined) {
            this.authUser = refreshToken.authUser;
            this.expiresIn = refreshToken.expiresIn;
        }
    }
}
