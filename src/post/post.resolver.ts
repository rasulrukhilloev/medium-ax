import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './models/post.model';
import { JwtAuthGuard } from 'src/auth/guards';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/models/user.model';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  //TODO add return types
  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() current_user: User,
  ) {
    return this.postService.create(createPostInput, current_user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post], { name: 'posts' })
  findPosts(
    @Args('cursor', { type: () => Int, nullable: true }) cursor?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.postService.findAll(cursor, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Post, { name: 'post' })
  findPost(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() currentUser: User,
  ) {
    return this.postService.findOne(id, currentUser.id);
  }
}
