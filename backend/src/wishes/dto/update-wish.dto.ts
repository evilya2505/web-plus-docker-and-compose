import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class UpdateWishDto {
  @ApiProperty({
    example: 'Чехол для телефона',
    description: 'Название подарка',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://i.pravatar.cc/300',
    description:
      'Ссылка на интернет-магазин, в котором можно приобрести подарок',
  })
  @IsString()
  @IsNotEmpty()
  link: string;

  @ApiProperty({
    example: 'https://i.pravatar.cc/300',
    description: 'Ссылка на изображение подарка',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: '1000', description: 'Стоимость подарка' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 'Чехол для телефона',
    description: 'Строка с описанием подарка',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1024)
  @IsNotEmpty()
  description: string;
}
