import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor() {
        console.log("AppService inicializado");
    }

    printSmthng(): string {
        return "Hello, user";
    }
}
