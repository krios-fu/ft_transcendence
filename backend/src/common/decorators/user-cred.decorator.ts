import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { IRequestUser } from "../interfaces/request-payload.interface";


export const UserCreds = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username: string | undefined = req.user?.data?.username;

        if (username === undefined) {
            throw new HttpException('request user has not logged in', HttpStatus.UNAUTHORIZED);
        }
        return username;
    }
)