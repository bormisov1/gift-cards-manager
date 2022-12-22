import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
//import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  /*   app.use(
    session({
      secret: 'a',
      resave: false,
      saveUninitialized: false,
      store: new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: false,
      },
    }),
  ); */

  app.use(passport.initialize());
  // app.use(passport.session());

  app.enableCors({
    origin: '*',
    allowedHeaders: 'Authorization, Content-Type',
    exposedHeaders: 'Authorization, Content-Type',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });
  //app.use((req, res) => {
  //  console.log({req, res})
  //})
  await app.listen(3000);
}
bootstrap();
