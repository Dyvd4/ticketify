import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Swagger
	const config = new DocumentBuilder()
		.setTitle("Ticketify api")
		.setDescription("This is the api of ticketify")
		.setVersion("1.0")
		.build()

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api/swagger", app, document)

	// Validation pipe
	app.useGlobalPipes(new ValidationPipe())

	// start
	await app.listen(8080);
}

bootstrap();
