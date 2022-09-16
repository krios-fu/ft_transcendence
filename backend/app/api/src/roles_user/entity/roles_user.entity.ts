import { Entity, PrimaryColumn } from 'typeorm';

@Entity(/* name */)
export class RolesUserEntity {
    @PrimaryColumn({
        ...Entity;
    })
    user: string;

    
}
