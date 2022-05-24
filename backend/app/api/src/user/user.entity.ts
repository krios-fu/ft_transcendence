import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;
};
