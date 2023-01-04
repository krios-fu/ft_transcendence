import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as fs from "fs";
import { extname } from "path";
import { BadRequestException, UnprocessableEntityException } from "@nestjs/common";
import { IRequestUser } from "src/common/interfaces/request-payload.interface";

export const DEFAULT_AVATAR_PATH = 'public/default-avatar.jpg';

function filterFileByType
    (
        req: IRequestUser, 
        file: Express.Multer.File,
        cb: Function
    ): void {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
    } else {
        cb(new UnprocessableEntityException('Invalid file type'), false);
    }
}

export const uploadUserAvatarSettings: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = './public/users/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req: IRequestUser, file: Express.Multer.File, cb): void => {
            const username = req.user?.data?.username;
            if (username === undefined || file.originalname === undefined) {
                cb(new BadRequestException('no user in request'), null);
            }
            cb(null, `${username}${extname(file.originalname)}`);
        },
    }),
    limits: { fileSize: 6000000 },
    fileFilter: filterFileByType
}

export const uploadRoomAvatarSettings: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = './public/room/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req: IRequestUser, file: Express.Multer.File, cb): void => {
            const roomId = req.params['room_id'];
            if (roomId === undefined) {
                cb(new BadRequestException('no room id provided'), null);
            }
            cb(null, `room-${roomId}${extname(file.originalname)}`)
        }
    }),
    limits: { fileSize: 6000000 },
    fileFilter: filterFileByType
}