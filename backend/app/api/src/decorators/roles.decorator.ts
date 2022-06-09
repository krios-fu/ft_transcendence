import { SetMetadata } from "@nestjs/common";
import { Roles } from "src/room/roles.enum";

export const ROLES_KEY = 'roles';
export const UserRole = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);