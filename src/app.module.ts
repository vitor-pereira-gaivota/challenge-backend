import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PeopleModule } from './people/people.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { UsersRepository } from './users/user.repository';
import { LocalsModule } from './locals/locals.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    ClientsModule,
    PeopleModule,
    LocalsModule,
  ],
  controllers: [],
  providers: [UsersRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'docs', method: RequestMethod.GET },
        { path: 'docs/swagger-ui.css', method: RequestMethod.GET },
        { path: 'docs/swagger-ui-bundle.js', method: RequestMethod.GET },
        {
          path: 'docs/swagger-ui-standalone-preset.js',
          method: RequestMethod.GET,
        },
        { path: 'docs/swagger-ui-init.js', method: RequestMethod.GET },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
