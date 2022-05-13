import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UsersModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
