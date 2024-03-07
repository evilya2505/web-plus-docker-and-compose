import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async create(createdWishlist: CreateWishlistDto, userId: number) {
    const wishlist = this.wishlistsRepository.create();
    wishlist.owner = await this.usersService.publicUser(userId);

    if (createdWishlist.itemsId && createdWishlist.itemsId.length > 0) {
      wishlist.items = await this.wishesService.findByIds(
        createdWishlist.itemsId,
      );
    } else {
      wishlist.items = [];
    }

    // wishlist.description = createdWishlist.description;
    wishlist.image = createdWishlist.image;
    wishlist.name = createdWishlist.name;

    await this.wishlistsRepository.save(wishlist);
    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistsRepository.find();
    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
    wishlist.owner = await this.usersService.publicUser(wishlist.owner.id);
    return wishlist;
  }

  async update(id: number, updatedWishlist: UpdateWishlistDto, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new NotFoundException(`Подборка с id ${id} не найдена.`);
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нет прав для редактирования подборки.');
    }

    wishlist.name = updatedWishlist.name;
    // wishlist.description = updatedWishlist.description;
    wishlist.image = updatedWishlist.image;
    wishlist.owner = await this.usersService.publicUser(userId);

    if (updatedWishlist.itemsId && updatedWishlist.itemsId.length > 0) {
      wishlist.items = await this.wishesService.findByIds(
        updatedWishlist.itemsId,
      );
    }

    await this.wishlistsRepository.save(wishlist);
    return wishlist;
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishlist) {
      throw new NotFoundException(`Подборка с id ${id} не найдена.`);
    }
    if (wishlist.owner.id === userId) {
      const removedWishlist = await this.wishlistsRepository.remove(wishlist);
      removedWishlist.owner = await this.usersService.publicUser(
        removedWishlist.owner.id,
      );
      return removedWishlist;
    } else {
      throw new ForbiddenException('Нет прав для удаления подборки.');
    }
  }
}
