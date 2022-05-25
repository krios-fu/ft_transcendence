import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserPwEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    extraValue: string;
};
