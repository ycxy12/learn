/**
 * 📚 第四阶段 - 应用入口 (含 Swagger)
 *
 * 💡 知识点：
 * - ValidationPipe 全局验证管道
 * - SwaggerModule 自动生成 API 文档
 * - enableCors() 启用跨域
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 CORS（CLIENT_ORIGIN 在 .env 中配置，生产环境填写真实域名/IP）
  app.enableCors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 全局拦截器与过滤器
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 配置
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('React + NestJS 全栈学习项目 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('认证', '用户注册、登录')
    .addTag('todos', 'Todo CRUD 操作')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 NestJS 服务已启动: http://localhost:${port}`);
  console.log(`📚 API 文档: http://localhost:${port}/api`);
}
bootstrap().catch(console.error);
