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
        origin: ['http://localhost:4200'],
        credentials: true,
    });
    app.useGlobalFilters(new NotValidatedExceptionFilter());
    app.use(cookieParser());
    await app.listen(3000);
}
bootstrap();
