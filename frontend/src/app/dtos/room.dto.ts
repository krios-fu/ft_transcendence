import { UserDto } from "./user.dto";

export class RoomDto{
	createdAt: Date;
	updatedAt: Date;
	id: number;
	roomName: string;
	photoUrl: string;
	owner: UserDto;
	ownerId: number;

	constructor(
	createdAt: Date,
	updatedAt: Date,
	id: number,
	roomName: string,
	photoUrl: string,
	owner: UserDto,
	ownerId: number,
	){
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.id = id;
		this.roomName = roomName;
		this.photoUrl = photoUrl;
		this.owner = owner;
		this.ownerId = ownerId;

	}

}