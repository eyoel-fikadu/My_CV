import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

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
    throw new NotFoundException('User not found');
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (user) {
      return this.userRepo.remove(user);
    }
    throw new NotFoundException('User not found');
  }

  async signup(email: string, password: string) {
    const user = await this.find(email);
    if (user.length) {
      throw new BadRequestException();
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '.' + hash.toString('hex');

    return await this.create(email, result);
  }

  async sign(email: string, password: string) {
    const [user] = await this.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') === storedHash) {
      return user;
    }
    throw new ForbiddenException('wrond user name and password');
  }
}
