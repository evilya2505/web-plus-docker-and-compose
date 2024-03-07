import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly userServices: UsersService,
  ) {}
  async create(createWishDto: CreateWishDto, userId: number) {
    const wish = this.wishesRepository.create(createWishDto);
    wish.owner = await this.userServices.publicUser(userId);
    await this.wishesRepository.save(wish);
    return wish;
  }

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find();

    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    wish.owner = await this.userServices.publicUser(wish.owner.id);
    wish.offers.forEach((offer) => {
      offer.user.password = undefined;
      offer.user.email = undefined;
      offer.user.createdAt = undefined;
      offer.user.updatedAt = undefined;
    });

    return wish;
  }
  async findLast(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  async findByIds(ids: number[]) {
    return this.wishesRepository.findByIds(ids);
  }

  async changeRaised(id: number, amount: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
    });
    wish.raised += amount;
    await this.wishesRepository.save(wish);
    return wish;
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    const existingWish = await this.wishesRepository.findOne({
      where: { id },
    });

    if (!existingWish) {
      throw new NotFoundException(`Подарок с id ${id} не найден.`);
    }

    existingWish.copied += 1;

    await this.wishesRepository.save(existingWish);

    const newWish = this.wishesRepository.create({
      name: existingWish.name,
      link: existingWish.link,
      image: existingWish.image,
      raised: 0,
      price: existingWish.price,
      description: existingWish.description,
      copied: existingWish.copied,
    });
    newWish.owner = await this.userServices.publicUser(userId);
    await this.wishesRepository.save(newWish);

    return newWish;
  }

  async update(id: number, updatedWish: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new NotFoundException(`Подарок с id ${id} не найден.`);
    }
    if (wish.offers.length == 0 && wish.owner.id == userId) {
      wish.name = updatedWish.name;
      wish.description = updatedWish.description;
      wish.price = updatedWish.price;
      wish.link = updatedWish.link;
      wish.image = updatedWish.image;
      await this.wishesRepository.save(wish);

      wish.owner = await this.userServices.publicUser(userId);

      return wish;
    } else {
      throw new ForbiddenException('Нет прав для редактирования.');
    }
  }

  async remove(id: number, userId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wish) {
      throw new NotFoundException(`Подарок с id ${id} не найден.`);
    }
    if (wish.owner.id === userId) {
      const removedWish = await this.wishesRepository.remove(wish);
      return removedWish;
    } else {
      throw new ForbiddenException('Нет прав для удаления.');
    }
  }
}
