import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    // API prefix
    app.setGlobalPrefix("api");

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle("Nexus ERP API")
        .setDescription("API para el sistema de gestión empresarial Nexus ERP")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);

    const port = process.env.PORT || 4000;
    await app.listen(port);

    console.log(`🚀 Nexus ERP API running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
