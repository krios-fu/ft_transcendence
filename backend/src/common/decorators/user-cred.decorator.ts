import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { IRequestUser } from "../interfaces/request-payload.interface";


export const UserCreds = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username: string | undefined = req.user?.data?.username;

        if (username === undefined) {
            throw new UnauthorizedException('Request user has not logged in');
        }
        return username;
    }
)