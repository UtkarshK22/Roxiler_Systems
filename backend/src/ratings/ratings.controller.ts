import {
  Controller,
  Get,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../common/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('owner')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('owner')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get('dashboard')
  @Roles(UserRole.STORE_OWNER)
  async getDashboard(@CurrentUser() user: User) {
    const data = await this.ratingsService.getOwnerDashboard(user.id);
    if (!data.store) {
      throw new NotFoundException('Store not found for this owner');
    }
    return data;
  }
}