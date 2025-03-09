import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/passport/jwt-auth.guard';
import { TransformInterceptor } from './transform.interceptor';
import { AllExceptionsFilter } from './exception.filter';
import { PostsModule } from './modules/posts/posts.module';
import { BannersModule } from './modules/banners/banners.module';
import { FileModule } from './modules/file/file.module';
import { InformationModule } from './modules/information/information.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    InformationModule,
    PostsModule,
    FileModule,
    BannersModule,
    // Env config module
    ConfigModule.forRoot({ isGlobal: true }),
    // Mongodb config mondule
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter }
  ],
})
export class AppModule { }
