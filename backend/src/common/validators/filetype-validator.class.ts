import { Injectable, PipeTransform, ArgumentMetadata } from "@nestjs/common";
import { detectFile } from 'magic-number';
import * as fs from 'fs';

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];

@Injectable()
export class FileTypeValidatorPipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
        const filename: string = value.filename;

        console.log(`Debugger: ${filename}`);
        console.log(`Debugger: ${detectFile(filename)}`)
        if (allowedTypes.includes(detectFile(filename))) {
                return true;
        } else {
            fs.unlinkSync(filename);
            return false;
        }
    }
}