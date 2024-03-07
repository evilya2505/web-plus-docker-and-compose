import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterResponseDto } from './dto/register-response-dto';
import { LoginResponseDto } from './dto/login-response-dto';
import { TokenSevice } from 'src/token/token.service';
import { LoginUserDto } from './dto/login-user-dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenSevice,
  ) {}

  async register(newUser: CreateUserDto): Promise<RegisterResponseDto> {
    const existUserWithEmail = await this.usersService.findUserByEmail(
      newUser.email,
    );
    const existUserWithUsername = await this.usersService.findUserByUsername(
      newUser.username,
    );

    if (existUserWithEmail || existUserWithUsername)
      throw new BadRequestException(
        'Пользователь с таким email или username уже зарегистрирован.',
      );

    const user = await this.usersService.create(newUser);
    return await this.usersService.publicUser(user.id);
  }

  async loginUser(user: LoginUserDto): Promise<LoginResponseDto> {
    const existUser = await this.usersService.findUserByUsernameWithPassword(
      user.username,
    );
    if (!existUser)
      throw new BadRequestException('Некорректная пара логин и пароль.');
    const validatePassword = await bcrypt.compare(
      user.password,
      existUser.password,
    );
    if (!validatePassword)
      throw new BadRequestException('Некорректная пара логин и пароль.');

    const userData = {
      id: existUser.id,
      email: existUser.email,
    };
    const token = await this.tokenService.generateJwtToken(userData);
    return { access_token: token };
  }
}
