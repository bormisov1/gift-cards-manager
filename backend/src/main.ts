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
const apiId = 27660986;
const apiHash = '6a124c2b7a6c0ba5cae7edd0868b404f';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';
import { Api } from 'telegram/tl';
const stringSession = new StringSession('');
(async () => {
  console.log('Loading interactive example...');
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () =>
      await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err),
  });
  console.log(client.session.save());
  console.log('You should now be connected.');
  client.session.save(); // Save this string to avoid logging in again
  await client.sendMessage('me', { message: 'Hello!' });
})();
bootstrap();
