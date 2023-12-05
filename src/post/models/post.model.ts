import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/models/user.model';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => User, { nullable: true })
  author: User;

  @Field(() => Int, { nullable: true })
  authorId: number;

  @Field(() => [User], { nullable: true })
  viewers: User[];
}
