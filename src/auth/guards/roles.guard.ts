import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    // if (!requiredRoles) {
    //   return true;
    // }
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req?.user || ctx.getContext().user;
    const bool = requiredRoles.some((role) => user.role?.includes(role));
    return bool;
  }
}
