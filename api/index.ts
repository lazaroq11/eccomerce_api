import { createServer, proxy } from 'aws-serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors();
  await app.init();
}

bootstrap();

const server = createServer(expressApp);


export default (req, res) => proxy(server, req, res);
