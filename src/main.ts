import {
  ClassSerializerInterceptor,
  Next,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { environment } from './config/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { request, response, NextFunction, Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const allowedOrigins = []; // Frontend en producción
  const allowedOrigins = environment().ALLOWED_ORIGINS; // IPs de desarrolladoras
  const allowedLocalIps = environment().ALLOWED_LOCAL_IPS; // IPs de desarrolladoras

  const globalPrefix = 'api/v1';

  app.setGlobalPrefix(globalPrefix);

  // app.enableCors({
  //   origin: (origin, callback) => {
  //     console.log(`Origin recibido: ${origin}`); // Depuración del origen
  //     if (!origin) {
  //       app.use((req: Request, res, next) => {
  //         const forwarded = req.headers['x-forwarded-for'];
  //         const clientIp =
  //           typeof forwarded === 'string'
  //             ? forwarded.split(',')[0]
  //             : req.socket.remoteAddress || '';

  //         console.log(`IP detectada: ${clientIp}`); // Depuración de la IP detectada

  //         if (!allowedLocalIps.includes(clientIp)) {
  //           return callback(
  //             new Error('Origen no especificado. Acceso denegado.'),
  //             false,
  //           );
  //         }
  //         next(); // Permitir acceso para IPs locales permitidas
  //       });
  //       return callback(null, true);
  //     }

  //     // Verificar si el origen está permitido en la lista
  //     if (allowedOrigins.includes(origin)) {
  //       return callback(null, true); // Origen permitido
  //     }

  //     // Bloquear solicitudes con un origen no permitido
  //     return callback(new Error('Origen no permitido por CORS.'), false);
  //   },
  // });

  // // Middleware adicional para verificar IP
  // app.use((req: Request, res, next) => {
  //   const forwarded = req.headers['x-forwarded-for'];
  //   const clientIp =
  //     typeof forwarded === 'string'
  //       ? forwarded.split(',')[0]
  //       : req.socket.remoteAddress || '';

  //   console.log(`IP detectada en middleware: ${clientIp}`); // Depuración adicional

  //   if (!allowedLocalIps.includes(clientIp)) {
  //     console.log(`Acceso denegado por IP: ${clientIp}`);
  //     res.status(403).send('Acceso denegado por IP.');
  //   } else {
  //     next(); // IP permitida
  //   }
  // });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión de string a number
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const env = environment(); // Llama a la función de configuración para obtener el entorno
  const port = env.PORT; // Obtiene el puerto desde la configuración

  const config = new DocumentBuilder()
    .setTitle('Gonvar Admin API')
    .setDescription('App de administración de negocios')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

  await app.listen(port);

  console.log(`Servidor levantado en http://localhost:${port}`);
}

bootstrap();
