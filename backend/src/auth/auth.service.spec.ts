import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User, UserRole } from '../common/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

const mockUser: User = {
  id: 'test-uuid-1',
  name: 'Test System Admin User',
  email: 'test@roxiler.com',
  password_hash: '$2a$12$hashedpassword',
  address: '123 Test Street',
  role: UserRole.SYSTEM_ADMIN,
  created_at: new Date(),
  updated_at: new Date(),
  ratings: [],
  stores: [],
};

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

const mockConfigService = {
  get: jest.fn((key: string, defaultValue?: string) => {
    const config: Record<string, string> = {
      JWT_SECRET: 'f5c1931cf81b62fc4b53778fedfa581c3d84600403ff95c33e1a96b2557e08a0a873a4771bed3009e06d0648d3207aca',
      JWT_EXPIRATION: '1d',
      BCRYPT_SALT_ROUNDS: '12',
    };
    return config[key] ?? defaultValue;
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return JWT token and user when credentials are valid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(mockUser);

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe('signup', () => {
    it('should create a new user with NORMAL_USER role', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed' as never);

      const result = await service.signup({
        name: 'Test Normal User Account',
        email: 'newuser@roxiler.com',
        password: 'TestPass123!',
        address: '456 Test Ave',
      });

      expect(result.role).toBe(UserRole.NORMAL_USER);
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRole.NORMAL_USER,
        }),
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.signup({
          name: 'Test Duplicate User Name',
          email: 'test@roxiler.com',
          password: 'TestPass123!',
        }),
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('changePassword', () => {
    it('should update password when current password is correct', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('newhashed' as never);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.changePassword(
        mockUser.id,
        'OldPass123!',
        'NewPass123!',
      );

      expect(result.message).toBe('Password updated successfully');
    });

    it('should throw UnauthorizedException when current password is wrong', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.changePassword(mockUser.id, 'WrongPass123!', 'NewPass123!'),
      ).rejects.toThrow('Current password is incorrect');
    });
  });
});