import { Exclude } from "class-transformer";
import { BaseEntity } from "src/common/classes/base.entity";
import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";
import { CreateUserDto } from "../dto/user.dto";

@Entity({
	name: 'user'
})
export class UserEntity extends BaseEntity {
	constructor(dto?: CreateUserDto) {
		super();
		if (dto !== undefined) {
			Object.assign(this, dto);
		}
	}

	@PrimaryGeneratedColumn('increment')
	id: number;

	@Column({ 
		unique: true 
	})
	readonly username : string;
	
	@Column() firstName : string;
	@Column() lastName : string;
	@Column() email : string;
	@Column() photoUrl : string;
  	@Column() profileUrl : string;

	@Column({
		type: 'varchar',
		unique: true,
		nullable: true,
		length: 12
	})
	nickName : string;

	@Exclude()
	@Column({
		type: 'boolean',
		default: false
	})
	doubleAuth : boolean;

	@Column({
		type: 'boolean',
		default: false
	})
	defaultOffline: boolean;

	@Column({ 
		type: 'boolean',
		default: false
	})
	acceptedTerms: boolean;
}
