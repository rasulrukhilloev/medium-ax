import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserRole } from './user/models/user-role.enum';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  await seedSuperAdminUser(userService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
async function seedSuperAdminUser(userService: UserService) {
  const superAdminEmail = 'medium@gmail.com';
  const superAdminUser = await userService.findOneByEmail(superAdminEmail);

  if (!superAdminUser) {
    await userService.createUser({
      name: 'MediumAdmin',
      email: superAdminEmail,
      password: 'strongPassword',
      role: UserRole.ADMIN,
    });
  }
}

bootstrap();
