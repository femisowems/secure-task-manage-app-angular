import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app/app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

export default async function handler(req: any, res: any) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    // Security Middleware
    app.use(helmet());

    // Global Validation
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Dynamic CORS configuration
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:4200',
        'https://secure-task-manage-app-angular-dash.vercel.app'
    ];

    if (process.env.CORS_ORIGIN) {
        allowedOrigins.push(...process.env.CORS_ORIGIN.split(','));
    }

    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    await app.init();
    const instance = app.getHttpAdapter().getInstance();
    instance(req, res);
}
