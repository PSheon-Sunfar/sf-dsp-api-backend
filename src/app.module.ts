import { MONGO_URI } from 'config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Users/user.module';
import { AuthModule } from './Auth/auth.module';
import { ArticleModule } from './Articles/article.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    UserModule,
    AuthModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
