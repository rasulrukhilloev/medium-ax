import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Post } from '@prisma/client';
import { CreatePostInput } from './dto/create-post.input';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createPostInput: CreatePostInput,
    authorId: number,
  ): Promise<Post> {
    return this.databaseService.post.create({
      data: {
        ...createPostInput,
        author: {
          connect: { id: authorId },
        },
      },
    });
  }

  async findAll(cursor?: number, limit?: number): Promise<Post[]> {
    return this.databaseService.post.findMany({
      take: limit || 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number): Promise<Post> {
    let _post;

    try {
      _post = await this.databaseService.post.findUnique({
        where: { id },
      });

      if (!_post) {
        throw new NotFoundException(`Post with ID ${id} not found.`);
      }

      this.databaseService.post.update({
        where: { id },
        data: {
          viewers: {
            connect: { id: userId },
          },
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Something failed.');
      }
    }

    return _post;
  }
}
