import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPwEntity } from './user/user.pw.entity'
import { AuthModule } from './auth/auth.module';
import { UserServices } from './user/user.service';

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
      AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserServices],
})


export class AppModule {}
