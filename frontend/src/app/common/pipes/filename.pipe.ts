import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'filename' })
export class FilenamePipe implements PipeTransform {
    transform(value: string | null): string {
        if (value === null) {
            return 'no avatar selected';
        }
        let captured: RegExpMatchArray | null = value.match(/([^\/])+$/)
        console.log(`Captured: ${captured}`)
        if (captured === null) {
            return 'undefined'; // ???
        }
        let filename = captured[0];
        console.log(`Filename: ${filename}`);
        return (filename.length >= 30)
            ? "..." + filename.slice(-27)
            : filename;
    }
}