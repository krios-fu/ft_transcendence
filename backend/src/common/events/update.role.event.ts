export type RoleCredentials = {
    userId: number,
    roomId?: number,
    ctxName: string
}
export class UpdateRoleEvent {
    userId: number;
    roomId?: number;
    ctxName: string;
    constructor(creds: RoleCredentials) {
        this.userId = creds.userId;
        this.roomId = creds.roomId;
        this.ctxName = creds.ctxName;
    }
}