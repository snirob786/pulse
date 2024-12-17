import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    let corsOption = {
      origin:
        process.env.PROD_STATUS === 'true' ? process.env.CORS_ORIGIN : '*',
      methods:
        process.env.PROD_STATUS === 'true'
          ? process.env.CORS_METHODS
          : 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Authorization',
    };
    console.log('🚀 ~ bootstrap ~ corsOption:', corsOption);
    app.enableCors(corsOption);

    // Set global API prefix
    app.setGlobalPrefix('api/v1');

    // Start the server
    console.log(
      'current port: ',
      process.env.PROD_STATUS === 'true' ? process.env.PORT : 5000,
    );
    await app.listen(
      process.env.PROD_STATUS === 'true' ? process.env.PORT : 5000,
    );
  } catch (error) {
    console.error('maintask error: ', error);
  }
}
bootstrap();
