import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AuthResponse } from './dto/login.dto';
import { User as UserModel } from 'src/user/models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    return isPasswordValid ? user : null;
  }

  async login(user: UserModel): Promise<AuthResponse> {
    const access_token = this.signToken(user.id, user.role, false);
    const refresh_token = this.signToken(user.id, user.role, true);

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { refreshToken: refresh_token },
    });

    return {
      access_token,
      refresh_token,
    };
  }

  private signToken(
    id: number,
    role: UserRole,
    refresh_token: boolean,
  ): string {
    const payload = {
      sub: id,
      role,
    };
    const options = {
      secret: refresh_token ? 'refresh_token_secret' : 'access_token_secret',
      expiresIn: refresh_token ? '7d' : '15m',
    };
    return this.jwtService.sign(payload, options);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const userId = this.getUserIdFromRefreshToken(refreshToken);
    if (!userId) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, refreshToken: true },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = this.signToken(user.id, user.role, false);
    const newRefreshToken = this.signToken(user.id, user.role, true);

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  getUserIdFromRefreshToken(token: string): number {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'refresh_token_secret',
      });
      return decoded.sub;
    } catch (e) {
      return null;
    }
  }

  async removeRefreshToken(userId: number) {
    await this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
