import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'username', description: 'Имя пользователя' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Пока ничего не рассказал о себе',
    description: 'О себе',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300', description: 'Аватар' })
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({ example: 'email@email.ru', description: 'Электронная почта' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123', description: 'Пароль' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
