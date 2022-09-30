import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RolesUserEntity } from "../entity/user_roles.entity";

@Injectable()
export class RolesUserRepository extends Repository<RolesUserEntity>{ }
