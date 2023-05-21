import { ExceptionFilter, 
    Catch, 
    ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { NotValidatedException } from '../classes/not-validated.exception';

@Catch(NotValidatedException)
export class NotValidatedExceptionFilter implements ExceptionFilter {
    catch(e: NotValidatedException, host: ArgumentsHost) { 
        const resp: Response = host
            .switchToHttp()
            .getResponse<Response>();

        resp
            .json({
                statusCode: 401,
                timestamp: new Date().toISOString(),
                path: '/login/2fa'
            });
    }
}