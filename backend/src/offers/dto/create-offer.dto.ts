import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({
    example: 1,
    description: 'Cодержит id товара',
  })
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({
    example: 'false',
    description:
      'Флаг, который определяет показывать ли информацию о скидывающемся в списке.',
  })
  @IsBoolean()
  hidden: boolean;

  @ApiProperty({
    example: '500',
    description: 'Cумма заявки',
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
