import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NotValidatedExceptionFilter } from './common/filters/not-validated.filter';
import { BannedExceptionFilter } from './common/filters/banned.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ 
        transform: true,
        whitelist: true,
        validateCustomDecorators: true
    }));
    app.enableCors({
        origin: [process.env.WEBAPP_IP],
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: [
            'Origin',
            'Accept', 
            'Authorization', 
            'Accept-Language', 
            'Content-Language',
            'Content-Type',
            'Location'
        ],
        exposedHeaders: ['Location'],
        credentials: true,
    });
    app.useGlobalFilters(
        new NotValidatedExceptionFilter(),
        new BannedExceptionFilter()
    );
    app.use(cookieParser());
    await app.listen(3000);
}
bootstrap();
