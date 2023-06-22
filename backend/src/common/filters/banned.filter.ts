import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { BannedException } from "../classes/banned.exception";
import { Response } from "express";

@Catch(BannedException)
export class BannedExceptionFilter implements ExceptionFilter {
    catch(_: BannedException, host: ArgumentsHost) {
        console.log('[ FILTER ] in banned exception filter');
        const r: Response = host
            .switchToHttp()
            .getResponse<Response>();
        r.status(403)
            .header('Location', '/wtf');
        r.send();
    }
}