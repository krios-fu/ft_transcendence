import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { RolesEntity } from "../entities/roles.entity";

@Injectable()
export class RolesRepository extends Repository<RolesEntity> { }