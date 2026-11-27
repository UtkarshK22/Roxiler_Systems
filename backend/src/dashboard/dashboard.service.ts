import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../common/entities/user.entity';
import { Store } from '../common/entities/store.entity';
import { Rating } from '../common/entities/rating.entity';

export interface AdminDashboardData {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) {}

  async getAdminDashboard(user: User): Promise<AdminDashboardData> {
    if (user.role !== UserRole.SYSTEM_ADMIN) {
      throw new ForbiddenException('Only system admin can access admin dashboard');
    }

    const totalUsers = await this.userRepository.count();
    const totalStores = await this.storeRepository.count();
    const totalRatings = await this.ratingRepository.count();

    return { totalUsers, totalStores, totalRatings };
  }
}