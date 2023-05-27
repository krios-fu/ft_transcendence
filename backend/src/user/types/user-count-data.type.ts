import { UserEntity } from "../entities/user.entity";

/*
**  The third number parameter is the offset of the UserEntity ordered list,
**  which is needed by the client's ranking service when requesting the
**  ranking results block where the target user appears.
*/

export type UserCountData = [UserEntity[], number]
                                | [UserEntity[], number, number];
