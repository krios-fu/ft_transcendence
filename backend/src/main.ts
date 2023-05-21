import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NotValidatedExceptionFilter } from './common/filters/not-validated.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ 
        transform: true,
        whitelist: true,
        validateCustomDecorators: true
    }));
    app.enableCors({
        origin: [process.env.WEBAPP_IP],
        allowedHeaders: ['Origin', 'Accept', 'Content-Type', 'Location', 'Authorization'],
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        allowedHeaders: [
            'Accept', 
            'Authorization', 
            'Accept-Language', 
            'Content-Language',
            'Location',
            'Content-Type'
        ],
        credentials: true,
    });
    app.useGlobalFilters(new NotValidatedExceptionFilter());
    app.use(cookieParser());
    await app.listen(3000);
}
bootstrap();
