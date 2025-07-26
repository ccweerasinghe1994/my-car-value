import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['reports'],
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['reports'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.userRepository.softDelete(id);
    return result.affected > 0;
  }

  async findUsersWithReportsCount(): Promise<any[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.reports', 'report')
      .select(['user.id', 'user.email', 'user.firstName', 'user.lastName'])
      .addSelect('COUNT(report.id)', 'reportCount')
      .where('user.deletedAt IS NULL')
      .groupBy('user.id')
      .getRawAndEntities();
  }

  async findUsersByEmailDomain(domain: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :domain', { domain: `%@${domain}` })
      .andWhere('user.deletedAt IS NULL')
      .getMany();
  }
}
