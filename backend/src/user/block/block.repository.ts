import { Repository } from 'typeorm';
import { BlockEntity } from './block.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockRepository extends Repository<BlockEntity> { }
