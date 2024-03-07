import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateWishlistDto {
  @ApiProperty({
    example: 'Подборка подарков для мамы',
    description: 'Название списка',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://i.pravatar.cc/300',
    description: 'Обложка для подборки',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  // @ApiProperty({
  //   example: "Подборка подарков для мамы",
  //   description: "Описание подборки",
  // })
  // @IsString()
  // @MinLength(1)
  // @MaxLength(1500)
  // @IsNotEmpty()
  // description: string;

  @ApiProperty({
    example: [1],
    description: 'Идентификаторы подарков',
  })
  @IsArray()
  @IsNotEmpty()
  itemsId: number[];
}
