import { 
    Injectable, 
    PipeTransform, 
    ArgumentMetadata, 
    UnprocessableEntityException, 
    BadRequestException 
} from "@nestjs/common";
import * as fs from 'fs';
import filetype from 'magic-bytes.js';
import { Express } from 'express';

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

@Injectable()
export class FileTypeValidatorPipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        if (value === undefined) {
            throw new BadRequestException('invalid file');
        }
        const { path } = value;
        const fileinfo = filetype(fs.readFileSync(path));

        if (!allowedTypes.includes(fileinfo[0]['mime'])) {
            fs.unlinkSync(path);
            throw new UnprocessableEntityException('file type not allowed');
        }
        return value;
    }
}