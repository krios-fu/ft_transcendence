import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {  TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt( process.env.DB_PORT ),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [ "dist/**/*.entity{.ts,.js}" ],
      autoLoadEntities: true
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule {}
