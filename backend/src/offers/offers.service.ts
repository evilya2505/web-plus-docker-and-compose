import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}
  async create(createdOffer: CreateOfferDto, userId: number) {
    const offer = this.offerRepository.create();
    // Пользователю нельзя вносить деньги на собственные подарки
    const wish = await this.wishesService.findOne(createdOffer.itemId);

    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        'Нет прав. Нельзя вносить деньги на собственные подарки',
      );
    } else {
      // Нельзя скинуться на подарки, на которые уже собраны деньги. Сумма собранных средств не может превышать стоимость подарка. При попытке оставить заявку на большую сумму сервис должен присылать ошибку с соответствующим текстом в теле.
      if (wish.raised >= wish.price) {
        throw new ForbiddenException('Деньги собраны.');
      } else {
        offer.amount = createdOffer.amount;
        offer.hidden = createdOffer?.hidden || false;
        offer.item = await this.wishesService.findOne(createdOffer.itemId);
        offer.user = await this.usersService.publicUser(userId);
        await this.offerRepository.save(offer);
        await this.wishesService.changeRaised(
          createdOffer.itemId,
          createdOffer.amount,
        );
        return offer;
      }
    }
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      where: { hidden: false },
    });
    return offers;
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!offer.hidden) {
      offer.user = await this.usersService.publicUser(offer.user.id);
    } else {
      delete offer.user;
    }
    return offer;
  }
}
