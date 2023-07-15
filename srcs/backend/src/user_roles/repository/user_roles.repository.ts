import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { UserRolesEntity } from "../entity/user_roles.entity";

@Injectable()
export class UserRolesRepository extends Repository<UserRolesEntity>{ }
