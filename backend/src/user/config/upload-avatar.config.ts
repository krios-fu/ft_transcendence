import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import * as fs from "fs";
import { extname } from "path";
import { HttpException, HttpStatus } from "@nestjs/common";
import { IRequestUser } from "src/common/interfaces/request-payload.interface";

export const uploadAvatarSettings: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const dir = './uploads/';
            if (!fs.existsSync(dir)) {
                const val = fs.mkdirSync(dir);
                console.log(`Testing mkdir ret: ${val}`);
            }
            cb(null, dir);
        },
        filename: (req: IRequestUser, file: Express.Multer.File, cb) => {
            cb(null, `${req.user.data.username}.${extname(file.filename)}`);
        },
    }),
    limits: { fileSize: 6000000 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            cb(null, true);
        } else {
            cb(new HttpException('File not processable', HttpStatus.UNPROCESSABLE_ENTITY), false)
        }
    }
}