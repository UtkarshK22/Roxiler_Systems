import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../common/entities/user.entity';
import { Store } from '../common/entities/store.entity';
import { ConfigService } from '@nestjs/config';

export interface UserFilters {
  name?: string;
  email?: string;
  address?: string;
  role?: UserRole;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private configService: ConfigService,
  ) {}

  async findAll(
    filters: UserFilters,
    page: number,
    limit: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ): Promise<UserListResponse> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filters.name) {
      queryBuilder.andWhere('user.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters.email) {
      queryBuilder.andWhere('user.email ILIKE :email', {
        email: `%${filters.email}%`,
      });
    }
    if (filters.address) {
      queryBuilder.andWhere('user.address ILIKE :address', {
        address: `%${filters.address}%`,
      });
    }
    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    queryBuilder.orderBy(`user.${safeSortBy}`, order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return { users, total, page, limit };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(dto: {
    name: string;
    email: string;
    password: string;
    address?: string;
    role: UserRole;
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    if (dto.role === UserRole.SYSTEM_ADMIN) {
      const adminCount = await this.userRepository.count({
        where: { role: UserRole.SYSTEM_ADMIN },
      });
      if (adminCount > 0) {
        throw new ForbiddenException('A system admin already exists');
      }
    }

    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') ?? '12',
      10,
    );
    const password_hash = await bcrypt.hash(dto.password, saltRounds);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password_hash,
      address: dto.address ?? null,
      role: dto.role,
    });

    return this.userRepository.save(user);
  }

  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') ?? '12',
      10,
    );
    user.password_hash = await bcrypt.hash(newPassword, saltRounds);
    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async getOwnerStoreRating(ownerId: string): Promise<{
    store: Store | null;
    averageRating: number | null;
  }> {
    const store = await this.storeRepository.findOne({
      where: { owner_id: ownerId },
    });
    if (!store) {
      return { store: null, averageRating: null };
    }

    const result = await this.storeRepository.manager.query(
      `SELECT AVG(rating)::numeric(10,2) as average_rating FROM ratings WHERE store_id = $1`,
      [store.id],
    );

    return {
      store,
      averageRating: result[0]?.average_rating
        ? parseFloat(result[0].average_rating)
        : null,
    };
  }
}