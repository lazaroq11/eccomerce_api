import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Eccomerce Api')
  .setDescription('API para gerenciamento de usuários, produtos e pedidos em um sistema de e-commerce.')
  .setVersion('1.0')
  .addTag('api')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('doc_api',app,document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
