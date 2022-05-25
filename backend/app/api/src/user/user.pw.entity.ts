import {
    Entity,
    Column,
    PrimaryColumn,
} from 'typeorm';
import { Injectable } from '@nestjs/common';

@Entity('UserPwEntity')
export class UserPwEntity {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;

    @Column()
    extraValue: string;
};
