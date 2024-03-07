import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { LoginResponseDto } from './dto/login-response-dto';
import { RegisterResponseDto } from './dto/register-response-dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('/')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @UsePipes(ValidationPipe)
  register(@Body() newUser: CreateUserDto): Promise<RegisterResponseDto> {
    return this.authService.register(newUser);
  }
  @Post('signin')
  @UsePipes(ValidationPipe)
  login(@Body() newUser: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.loginUser(newUser);
  }
}
