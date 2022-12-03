import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//import { ServeStaticModule } from '@nestjs/serve-static';
//import { join } from 'path';

//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { GiftCardsModule } from './modules/gift-card/gift-card.module';
import { AuthModule } from './modules/auth/auth.module';
import { FileHandlerModule } from './modules/file-handler/file-handler.module';
//import { APP_FILTER } from '@nestjs/core';
//APP_INTERCEPTOR
//import { HttpExceptionFilter } from './shared/filters';
//import * as winston from 'winston';
//import { WinstonModule } from 'nest-winston';
//import 'dotenv/config';
//import { NODE_ENV } from './shared/enums';
//import { HttpConsoleLoggerInterceptor } from './shared/interceptors';

//const winstonTransports = [];

/* if (process.env.ENV === NODE_ENV.PRODUCTION) {
  winstonTransports = [
    new winston.transports.File({
      filename: `logs/${new Date()
        .toLocaleDateString()
        .replace(/\//g, '-')}/error.log`,
      level: 'error',
    }),
  ];
} else {
  winstonTransports = [new winston.transports.Console()];
} */

@Module({
  imports: [
    /*     WinstonModule.forRoot({
      transports: winstonTransports,
    }), */
    AuthModule,
    GiftCardsModule,
    FileHandlerModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    /*     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'tracker'),
      serveStaticOptions: {
        index: 'tracker.js'
      }
    }), */
  ],
  //controllers: [AppController],
  providers: [
    //AppService,
    /*     {
      provide: APP_INTERCEPTOR,
      useClass: HttpConsoleLoggerInterceptor,
    }, */
    /*  {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }, */
  ],
})
export class AppModule {}
