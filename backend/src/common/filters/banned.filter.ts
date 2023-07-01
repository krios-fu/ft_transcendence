import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { BannedException } from "../classes/banned.exception";
import { Response } from "express";

@Catch(BannedException)
export class BannedExceptionFilter implements ExceptionFilter {
    catch(_: BannedException, host: ArgumentsHost) {
        const r: Response = host
            .switchToHttp()
            .getResponse<Response>();
        r.status(403)
            .header('Location', '/wtf');
        r.send();
    }
}