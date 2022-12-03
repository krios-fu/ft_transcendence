import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { BlockEntity } from '../entities/block.entity';

@Injectable()
export class BlockRepository extends Repository<BlockEntity> { }
