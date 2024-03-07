import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'username', description: 'Имя пользователя' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: '123', description: 'Пароль' })
  password: string;
}
