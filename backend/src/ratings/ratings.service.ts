import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../common/entities/rating.entity';
import { Store } from '../common/entities/store.entity';
import { User } from '../common/entities/user.entity';

export interface RaterInfo {
  id: string;
  name: string;
  email: string;
  rating: number;
  created_at: Date;
}

export interface OwnerDashboardData {
  store: Store | null;
  averageRating: number | null;
  raters: RaterInfo[];
}

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOwnerDashboard(ownerId: string): Promise<OwnerDashboardData> {
    const store = await this.storeRepository.findOne({
      where: { owner_id: ownerId },
    });
    if (!store) {
      return { store: null, averageRating: null, raters: [] };
    }

    const avgResult = await this.storeRepository.manager.query(
      `SELECT AVG(rating)::numeric(10,2) as average_rating FROM ratings WHERE store_id = $1`,
      [store.id],
    );
    const averageRating = avgResult[0]?.average_rating
      ? parseFloat(avgResult[0].average_rating)
      : null;

    const ratings = await this.ratingRepository.find({
      where: { store_id: store.id },
      order: { created_at: 'DESC' },
    });

    const raters: RaterInfo[] = [];
    for (const rating of ratings) {
      const user = await this.userRepository.findOne({
        where: { id: rating.user_id },
      });
      if (user) {
        raters.push({
          id: user.id,
          name: user.name,
          email: user.email,
          rating: rating.rating,
          created_at: rating.created_at,
        });
      }
    }

    return { store, averageRating, raters };
  }
}