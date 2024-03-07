import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();

    return users;
  }
  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }
  async findUserByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }
  async findUserByUsernameWithPassword(username: string) {
    return this.usersRepository.findOne({
      where: { username },
    });
  }
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    return user;
  }

  async getOwnWishes(id: number): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { wishes: true },
    });

    return user.wishes;
  }

  async getWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: { wishes: true },
    });

    return user.wishes;
  }

  async getProfile(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
      },
    });
  }

  // API не возвращает хеш пароля пользователя и его почту (за исключением метода получения профиля пользователя).
  async publicUser(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
      },
    });
  }
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async update(updatedUser: UpdateUserDto, userId: number) {
    // Проверяем наличие пользователя с такими данными до обновления
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: updatedUser.email }, { username: updatedUser.username }],
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException(
        'Пользователь с таким email или username уже существует',
      );
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    Object.assign(user, updatedUser);

    if (updatedUser.password) {
      user.password = await this.hashPassword(updatedUser.password);
    }

    await this.usersRepository.save(user);

    const publicUser = await this.publicUser(userId);

    return publicUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);

    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);
    return user;
  }

  async findMany(res: { query: string }): Promise<User[]> {
    let user: User;
    if (
      res.query.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      user = await this.findUserByEmail(res.query);
    } else {
      user = await this.findUserByUsername(res.query);
    }

    if (!user) {
      return [];
    }

    return [user];
  }
}
