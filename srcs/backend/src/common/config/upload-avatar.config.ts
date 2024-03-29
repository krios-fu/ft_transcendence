import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as fs from "fs";
import { extname } from "path";
import { BadRequestException, UnprocessableEntityException } from "@nestjs/common";
import { IRequestUser } from "src/common/interfaces/request-payload.interface";
import { Express } from 'express';


export const DEFAULT_AVATAR_PATH = '/static/users/default-avatar.jpg';

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
            const dir = 'dist/static/users/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            } else {
                cb(null, dir);
            }
        },
        filename: (req: IRequestUser, file: Express.Multer.File, cb): void => {
            const username = req.user?.data?.username;
            if (username === undefined || file.originalname === undefined) {
                cb(new BadRequestException('no user in request'), null);
            } else {
                cb(null, `${username}${extname(file.originalname)}`);
            }
        },
    }),
    limits: { fileSize: 6000000 },
    fileFilter: filterFileByType
}

export const uploadRoomAvatarSettings: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = 'dist/static/room/';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            cb(null, dir);
        },
        filename: (req: IRequestUser, file: Express.Multer.File, cb): void => {
            const roomId = req.params['room_id'];
            if (roomId === undefined || isNaN(Number(roomId))) {
                cb(new BadRequestException('no valid room id provided'), null);
            } else {
                cb(null, `room-${roomId}${extname(file.originalname)}`)
            }
        }
    }),
    limits: { fileSize: 6000000 },
    fileFilter: filterFileByType
}