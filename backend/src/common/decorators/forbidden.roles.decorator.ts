import { SetMetadata } from "@nestjs/common";

export const ForbiddenRoles = (...roles: string[]) => SetMetadata('forbiddenRoles', roles);