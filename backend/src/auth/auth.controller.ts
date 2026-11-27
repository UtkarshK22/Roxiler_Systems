import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../common/entities/user.entity';

interface AuthenticatedRequest extends ExpressRequest {
  user: User;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'admin@example.com' },
        password: { type: 'string', example: 'Password123!' },
      },
    },
  })
  login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  signup(@Body() body: { name: string; email: string; password: string; address?: string }) {
    return this.authService.signup(body);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() body: { current_password: string; new_password: string },
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.current_password,
      body.new_password,
    );
  }
}