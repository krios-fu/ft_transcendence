import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesUserService {
    @InjectRepository()
    
    async getRoleUser() { 
        /* from body { user_id, role_id }, return role_user key id */
    }

    async getAllRolesFromUser() { 
        /* from user id, return all role_user entities with it */
    }

    async getUsersWithRole() { 
        /* from role id, return all users with this id */
    }

    async assignRoleToUser() { 
        /* create a new role entity with provided { user_id, role_id } */
    }

    async deleteRoleFromUser() { 
        /* remove role_entity by id */
    }
}
                                                          