import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {MembershipEntity} from "../entities/membership.entity";

@Injectable()
export class MembershipRepository extends Repository<MembershipEntity> { }