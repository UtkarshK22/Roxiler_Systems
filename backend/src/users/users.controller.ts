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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../common/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER, UserRole.STORE_OWNER)
  async findAll(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('role') role?: UserRole,
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
    return this.usersService.findAll(
      { name, email, address, role },
      pageNum,
      limitNum,
      sortBy,
      order,
    );
  }

  @Get(':id')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER, UserRole.STORE_OWNER)
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @Roles(UserRole.SYSTEM_ADMIN)
  async create(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      address?: string;
      role: UserRole;
    },
  ) {
    return this.usersService.create(body);
  }

  @Post('password')
  @Roles(UserRole.SYSTEM_ADMIN, UserRole.NORMAL_USER, UserRole.STORE_OWNER)
  async updatePassword(
    @CurrentUser() user: User,
    @Body()
    body: { current_password: string; new_password: string },
  ) {
    return this.usersService.updatePassword(
      user.id,
      body.current_password,
      body.new_password,
    );
  }
}