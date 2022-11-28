import { Roles } from "src/room/roles.enum";
export declare const ROLES_KEY = "roles";
export declare const MinRoleAllowed: (role: Roles) => import("@nestjs/common").CustomDecorator<string>;
