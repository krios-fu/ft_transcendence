import { SetMetadata } from "@nestjs/common";

export const RequiredRoles = (...roles: string[]) => SetMetadata('allowedRoles', roles);