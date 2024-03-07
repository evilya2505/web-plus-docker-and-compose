import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { Offer } from 'src/offers/entities/offer.entity';
import { JwtStrategy } from 'src/strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer]), UsersModule],
  controllers: [WishesController],
  providers: [WishesService, JwtStrategy],
  exports: [WishesService],
})
export class WishesModule {}
