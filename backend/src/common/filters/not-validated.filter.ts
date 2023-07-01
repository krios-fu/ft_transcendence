import { ExceptionFilter, 
    Catch, 
    ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { NotValidatedException } from '../classes/not-validated.exception';

@Catch(NotValidatedException)
export class NotValidatedExceptionFilter implements ExceptionFilter {
    catch(_: NotValidatedException, host: ArgumentsHost) { 
        const res: Response = host
            .switchToHttp()
            .getResponse<Response>();
        res.status(401)
            .header('Location', '/login/2fa');
        res.send();
    }
}