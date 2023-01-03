import { Injectable, PipeTransform, ArgumentMetadata, UnprocessableEntityException } from "@nestjs/common";
import * as fs from 'fs';
import filetype from 'magic-bytes.js';

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

@Injectable()
export class FileTypeValidatorPipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        const { path } = value;
        const fileinfo = filetype(fs.readFileSync(path));

        if (!allowedTypes.includes(fileinfo[0]['mime'])) {
            fs.unlinkSync(path);
            throw new UnprocessableEntityException('file type not allowed');
        }
        return value;
    }
}