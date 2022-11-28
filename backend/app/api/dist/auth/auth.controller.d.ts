import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDto } from 'src/user/user.dto';
import { IRequestUser } from 'src/interfaces/request-payload.interface';
interface IRequestProfile extends Request {
    user: UserDto;
}
export declare class AuthController {
    private authService;
    private readonly logger;
    constructor(authService: AuthService, logger: Logger);
    authFromFT(req: IRequestProfile, res: Response): Promise<IAuthPayload>;
    refreshToken(req: Request, res: Response): Promise<IAuthPayload>;
    logout(req: IRequestUser, res: Response): void;
}
export {};
