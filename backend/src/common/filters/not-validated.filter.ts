import { ExceptionFilter, 
    Catch, 
    ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { NotValidatedException } from '../classes/not-validated.exception';

@Catch(NotValidatedException)
export class NotValidatedFilter implements ExceptionFilter {
    catch(e: NotValidatedException, host: ArgumentsHost) { 
        const ctx = host.switchToHttp();
        const resp: Response = ctx.getResponse<Response>();
        const status: number = e.getStatus();

        console.log('DEBUG: get status: ', status);
        resp
            .status(302)
            .json({
                statusCode: 302,
                timestamp: new Date().toISOString(),
                path: '/otp-session/validate'
            });
    }
}