import { BaseEntity } from "../../common/classes/base.entity";
import { UserEntity } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export interface RefreshTokenOptions {
    authUser: UserEntity;
    expiresIn: Date;
}

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    token: string;

    @OneToOne
    (
        () => UserEntity,
        (user: UserEntity) => user.token,
		{ 
            onDelete: 'CASCADE',
            eager: true
        }
    )
    @JoinColumn({ name: 'token_user' })
    authUser: UserEntity;

    @Column({
        type: Date,
    })
    expiresIn: Date;

    constructor(refreshToken?: RefreshTokenOptions) {
        super();
        if (refreshToken != undefined) {
            this.authUser = refreshToken.authUser;
            this.expiresIn = refreshToken.expiresIn;
        }
    }
}
