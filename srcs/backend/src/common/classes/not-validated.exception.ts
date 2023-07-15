import { HttpException, HttpStatus } from '@nestjs/common';

export class NotValidatedException extends HttpException {
    constructor(reason?: string) {
        if (reason === undefined) {
            reason = 'User with 2fa activated but not validated';
        }
        super(reason, HttpStatus.FORBIDDEN); 
    }
}