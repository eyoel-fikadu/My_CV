import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });

    return this.userRepo.save(user);
  }

  findOne(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  find(email: string) {
    return this.userRepo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });

    if (user) {
      Object.assign(user, attrs);
      return this.userRepo.save(user);
    }
    throw new Error('User not found');
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (user) {
      return this.userRepo.remove(user);
    }
    throw new Error('User not found');
  }
}
