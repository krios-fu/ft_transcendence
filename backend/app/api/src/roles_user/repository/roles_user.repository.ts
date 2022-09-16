import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RolesUserEntity } from "../entity/roles_user.entity";

@Injectable()
export class RolesUserRepository extends Repository<RolesUserEntity>{ }
