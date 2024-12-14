import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { environment } from './environment';

export const typeOrmConfig = (): TypeOrmModuleOptions => {
  const env = environment(); // Llama a la función de configuración

  return {
    type: 'postgres', // Cambia esto según tu base de datos
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
    autoLoadEntities: true, // Carga automáticamente las entidades
    synchronize: true, // No usar en producción
    dropSchema: true,
    extra: {
      // Aquí se establece el uso horario en UTC
      timezone: 'Z', // Esto establece el uso horario en UTC
    },
  };
};
