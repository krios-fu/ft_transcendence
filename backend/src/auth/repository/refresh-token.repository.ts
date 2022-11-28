import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RefreshTokenEntity } from "../entity/refresh-token.entity";

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> { }
