import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
