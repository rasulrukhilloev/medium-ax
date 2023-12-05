import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { AuthResolver } from './auth.resolver';
import { JwtAuthGuard, RolesGuard, LocalAuthGuard } from './guards';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'access_token_secret', // TODO .env
      signOptions: { expiresIn: '15m' },
      // global: true,
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    RolesGuard,
  ],
  // exports: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
