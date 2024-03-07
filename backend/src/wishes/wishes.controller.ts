import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Controller('wishes')
@ApiTags('Wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() request: any) {
    const user = request.user;

    return this.wishesService.create(createWishDto, user.id);
  }

  @Get('/last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('/top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/copy')
  copy(@Param('id') id: string, @Req() request: any) {
    const user = request.user;

    return this.wishesService.copyWish(+id, user.id);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() request: any,
  ) {
    const user = request.user;
    return this.wishesService.update(+id, updateWishDto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: any) {
    const user = request.user;

    return this.wishesService.remove(+id, user.id);
  }
}
