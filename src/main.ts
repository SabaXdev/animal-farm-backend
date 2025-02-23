import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to alloew requests from anywhere
  app.enableCors({
    origin: 'https://sabaxdev.github.io',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  app.use('/public', express.static(join(__dirname, '..', 'public')));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
