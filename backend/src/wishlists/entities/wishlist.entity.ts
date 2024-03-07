import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  Relation,
} from 'typeorm';

@Entity('wishlists')
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column({ default: '' })
  description: string;

  @ManyToMany(() => Wish, (wish: Wish) => wish.wishlists)
  @JoinTable()
  items: Relation<Wish[]>;

  @ManyToOne(() => User, (user: User) => user.wishlists)
  owner: User;
}
