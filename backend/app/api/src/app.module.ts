import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

/* Apuntes sobre Modules        *
 *   Clase con @Module decorator
 *   @Module recibe un sólo objeto con las siguientes propiedades:
 *     providers - instanciados por el injector de Nest, compartidos 
 *       por el módulo.
 *     controllers - set de controladores que deben ser instanciados
 *     imports - lista de módulos que exportan proveedores que serán usados
 *       en este módulo
 *     exports - subset de proveedores que estarán disponibles
 *       en módules que exporten a éste
 *    ( singletons )
 *
 *  El concepto fundamental de un proveedor es que se puede
 *  inyectar como dependencia.
 *                              */

/* Dependency injection         *
 *   Delegación de instanciamiento de dependencias en NestJS
 *   La 'inyección' suele darse de forma típica en los constructores
 *   de diferentes clases 'constructor(private depInjected: DepInjected)'
 *   Este proveedor inyectado ha de ser registrado como tal en el módulo.
 *   
 *   El decorador @Injectable() no hace más que indicar al IoC cont. que 
 *   puede ser gestionado por él.
 *   Al instanciar un controlador (por ejemplo), nest comprobará las dependencias
 *   y (por default cada instancia es un singleton) devuelve una instancia ya
 *   cacheada si la hubiera, o la creará si no encontrara ninguna.

 *   Las dependencias en clases son resueltas en bootstrapping de abajo a arriba.
 *                              */

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWD,
            database: process.env.DB_NAME,
            synchronize: true,
            entities: ["dist/**/*.entity{.ts,.js}"],
            autoLoadEntities: true
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {
    constructor() {
        console.log("AppModule inicializado");
    }
}
