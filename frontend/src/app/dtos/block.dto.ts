export class Friendship
{
    createdAt: string;
    updatedAt: string;
    id: number;
    senderId: number;
    receiverId:number;
    status: string;
    block?:  Block;

	constructor(
		createdAt: string,
		updatedAt: string,
		id: number,
		senderId: number,
		receiverId:number,
		status: string,
		block?:  Block,
	){
		this.block = block;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.id = id;
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.status = status;
	}
}


class Block{
		createdAt: string;
		updatedAt: string;
		id: number;
		friendshipId: number;
		blockSenderId: number;
		constructor (
			createdAt: string,
			updatedAt: string,
			id: number,
			friendshipId: number,
			blockSenderId: number,
		){
			this.blockSenderId = blockSenderId;
			this.createdAt = createdAt;
			this.friendshipId = friendshipId;
			this.updatedAt = updatedAt;
			this.id = id;
		}
}