import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { UsersModule } from './modules/users/users.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        let typeORMOptions = {
          type: configService.get('DATABASE_TYPE'),
          host: configService.get('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT'),
          username: configService.get('DATABASE_USERNAME'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [configService.get('TYPEORM_ENTITIES')],
          autoLoadEntities: true,
          synchronize: true,
        } as TypeOrmModuleOptions;

        if (process.env.NODE_ENV !== 'local') {
          typeORMOptions = {
            type: configService.get('DATABASE_TYPE'),
            port: configService.get('DATABASE_PORT'),
            username: configService.get('DATABASE_USERNAME'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_NAME'),
            autoLoadEntities: true,
            synchronize: true,
            extra: {
              socketPath: configService.get('DATABASE_HOST'),
            },
          } as TypeOrmModuleOptions;
        }

        return typeORMOptions;
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
