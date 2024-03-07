import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me/wishes')
  getOwnWishes(@Req() request: any) {
    const user = request.user;
    return this.usersService.getOwnWishes(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/me')
  findMe(@Req() request: any) {
    const user = request.user;
    return this.usersService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findUserByUsername(username);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':username/wishes')
  getWishes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/find')
  async findMany(@Body() res: { query: string }) {
    return await this.usersService.findMany(res);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/me')
  update(@Body() updatedUser: UpdateUserDto, @Req() request: any) {
    const user = request.user;
    return this.usersService.update(updatedUser, user.id);
  }
}
