import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { IRequestUser } from "../interfaces/request-payload.interface";
import { UserCredsDto } from "../dtos/user.creds.dto";


export const UserCreds = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req: IRequestUser = ctx.switchToHttp().getRequest();
        const username: string | undefined = req.user?.data?.username;
        const id: number | undefined = req.user?.data?.id;
        
        if (username === undefined) {
            throw new UnauthorizedException('Request user has not logged in');
        }
        return new UserCredsDto(username, id);
    }
)