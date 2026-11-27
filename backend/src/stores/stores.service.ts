import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../common/entities/store.entity';
import { User, UserRole } from '../common/entities/user.entity';
import { Rating } from '../common/entities/rating.entity';

export interface StoreFilters {
  name?: string;
  email?: string;
  address?: string;
}

export interface StoreListResponse {
  stores: Array<
    Store & { average_rating: number | null; my_rating: number | null }
  >;
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async findAll(
    filters: StoreFilters,
    userId: string | null,
    page: number,
    limit: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ): Promise<StoreListResponse> {
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.ratings', 'rating');

    if (filters.name) {
      queryBuilder.andWhere('store.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }
    if (filters.email) {
      queryBuilder.andWhere('store.email ILIKE :email', {
        email: `%${filters.email}%`,
      });
    }
    if (filters.address) {
      queryBuilder.andWhere('store.address ILIKE :address', {
        address: `%${filters.address}%`,
      });
    }

    const allowedSortFields = ['name', 'email', 'address', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    queryBuilder.orderBy(`store.${safeSortBy}`, order);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [stores, total] = await queryBuilder.getManyAndCount();

    const enrichedStores = await Promise.all(
      stores.map(async (store) => {
        const avgResult = await this.storeRepository.manager.query(
          `SELECT AVG(rating)::numeric(10,2) as average_rating FROM ratings WHERE store_id = $1`,
          [store.id],
        );
        const averageRating = avgResult[0]?.average_rating
          ? parseFloat(avgResult[0].average_rating)
          : null;

        let myRating: number | null = null;
        if (userId) {
          const myRatingResult = await this.ratingRepository.findOne({
            where: { user_id: userId, store_id: store.id },
          });
          myRating = myRatingResult?.rating ?? null;
        }

        return {
          ...store,
          average_rating: averageRating,
          my_rating: myRating,
        };
      }),
    );

    return { stores: enrichedStores, total, page, limit };
  }

  async findById(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  async create(dto: {
    name: string;
    email: string;
    address: string;
    owner_id: string;
  }): Promise<Store> {
    const existingStore = await this.storeRepository.findOne({
      where: { email: dto.email },
    });
    if (existingStore) {
      throw new ConflictException('Store email already exists');
    }

    const owner = await this.userRepository.findOne({
      where: { id: dto.owner_id, role: UserRole.STORE_OWNER },
    });
    if (!owner) {
      throw new NotFoundException(
        'Owner not found or is not a STORE_OWNER',
      );
    }

    const existingOwnerStore = await this.storeRepository.findOne({
      where: { owner_id: dto.owner_id },
    });
    if (existingOwnerStore) {
      throw new ConflictException('Owner already has a store');
    }

    const store = this.storeRepository.create({
      name: dto.name,
      email: dto.email,
      address: dto.address,
      owner_id: dto.owner_id,
    });

    return this.storeRepository.save(store);
  }

  async upsertRating(
    storeId: string,
    userId: string,
    ratingValue: number,
  ) {
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (ratingValue < 1 || ratingValue > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { user_id: userId, store_id: storeId },
    });

    if (existingRating) {
      existingRating.rating = ratingValue;
      await this.ratingRepository.save(existingRating);
      return existingRating;
    }

    const rating = this.ratingRepository.create({
      user_id: userId,
      store_id: storeId,
      rating: ratingValue,
    });
    return this.ratingRepository.save(rating);
  }
}