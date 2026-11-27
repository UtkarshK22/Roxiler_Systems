import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../common/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER, UserRole.STORE_OWNER)
  async findAll(
    @CurrentUser() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'name',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Invalid page or limit');
    }
    return this.storesService.findAll(
      { name, email, address },
      user.id,
      pageNum,
      limitNum,
      sortBy,
      order,
    );
  }

  @Get('admin')
  @Roles(UserRole.SYSTEM_ADMIN)
  async findAllAdmin(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('sortBy') sortBy = 'name',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      throw new BadRequestException('Invalid page or limit');
    }
    return this.storesService.findAll(
      { name, email, address },
      null,
      pageNum,
      limitNum,
      sortBy,
      order,
    );
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  async create(
    @Body()
    body: {
      name: string;
      email: string;
      address: string;
      owner_id: string;
    },
  ) {
    return this.storesService.create(body);
  }

  @Post(':id/rating')
  @Roles(UserRole.NORMAL_USER)
  async upsertRating(
    @Param('id') storeId: string,
    @CurrentUser() user: User,
    @Body() body: { rating: number },
  ) {
    return this.storesService.upsertRating(storeId, user.id, body.rating);
  }
}