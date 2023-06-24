import { HttpException, HttpStatus } from "@nestjs/common";

export class BannedException extends HttpException {
    constructor(reason?: string) {
        if (!reason) {
            reason = 'User has been banned from the server';
        }
        super(reason, HttpStatus.FORBIDDEN);
    }
}