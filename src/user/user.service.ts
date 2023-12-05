import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { DatabaseService } from 'src/database/database.service';
// import { User } from './models/user.model';
import { UsersArgs } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  //TODO return types
  async createUser(createUserInput: CreateUserInput) {
    const salt = await bcrypt.genSalt();
    const hashed_pass = await bcrypt.hash(createUserInput.password, salt);
    try {
      const user = await this.databaseService.user.create({
        data: {
          ...createUserInput,
          password: hashed_pass,
        },
      });
      return user;
    } catch (err) {
      //TODO constants.ts as prismaUniquePropertyExecption
      if (err.code == 'P2002')
        throw new BadRequestException('Email already taken');
      throw new BadRequestException();
    }
  }

  findAllUsers(usersArgs: UsersArgs) {
    return this.databaseService.user.findMany({ ...usersArgs });
  }

  findOne(id: number) {
    const user = this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOneByEmail(email: string) {
    const user = this.databaseService.user.findUnique({
      where: { email },
    });
    if (!user) throw new NotFoundException();
    return user;
  }
}
