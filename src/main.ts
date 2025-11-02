import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
  console.log(`Nest app running on http://localhost:${process.env.PORT || 3000}`);
}

bootstrap();
