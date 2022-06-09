import {UserDto} from "../../user/user.dto";

export class ChatDto {
    id : number;
    createdAt: Date;
    UserOne : UserDto;
    UserTwo : UserDto;
}
