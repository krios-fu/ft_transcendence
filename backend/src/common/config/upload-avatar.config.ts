import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as fs from "fs";
import { extname } from "path";
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { IRequestUser } from "src/common/interfaces/request-payload.interface";

export const DEFAULT_AVATAR_PATH = './uploads/users/default.jpg';

function filterFileByType
    (
        req: IRequestUser, 
        file: Express.Multer.File,
        cb: Function
    ): void {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
    } else {
        cb(new HttpException('File not processable', HttpStatus.UNPROCESSABLE_ENTITY), false)
    }
}

export const uploadUserAvatarSettings: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = './uploads/users';
            if (!fs.existsSync(dir)) {
                const val = fs.mkdirSync(dir);
                console.log(`Testing mkdir ret: ${val}`);
            }
            cb(null, dir);
        },
        filename: (req: IRequestUser, file: Express.Multer.File, cb) => {
            const username = req.user?.data?.username;
            if (username === undefined || file.filename === undefined) {
                cb(new BadRequestException(), null);
            }
            cb(null, `${req.user.data.username}.${extname(file.filename)}`);
        },
    }),
    limits: { fileSize: 6000000 },
    fileFilter: filterFileByType
}

export const uploadRoomAvatarSettings: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = './uploads/room';
            if (!fs.existsSync(dir)) {
                const val = fs.mkdirSync(dir);
                console.log(`Testing mkdir ret: ${val}`);
            }
            cb(null, dir);
        },
        filename: 
            (
                req: IRequestUser,
                file: Express.Multer.File,
                cb
            ): void => {
            const roomId = req.params['room_id'];
            if (roomId === undefined) {
                cb(new BadRequestException('no room id provided'), null);
            }
            cb(null, `room-${roomId}.${extname(file.filename)}`) /* !!! */
        }
    }),
    limits: { fileSize: 6000000 },
    fileFilter: filterFileByType
}