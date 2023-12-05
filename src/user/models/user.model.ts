import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from './user-role.enum';
import { Post } from 'src/post/models/post.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Post)
  posts: Post[];

  @Field(() => [Post], { nullable: true })
  viewedPosts: Post[];
}
