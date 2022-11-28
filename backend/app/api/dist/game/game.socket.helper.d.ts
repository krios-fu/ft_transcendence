import { Server, Socket } from "socket.io";
export declare class SocketHelper {
    addUserToRoom(server: Server, username: string, roomId: string): Promise<void>;
    emitToRoom(server: Server, roomId: string, eventId: string, data?: any): void;
    clearRoom(server: Server, roomId: string): Promise<void>;
    getClientRoomPlayer(client: Socket): [string, string];
}
