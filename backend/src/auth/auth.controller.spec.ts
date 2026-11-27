import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn(),
  signup: jest.fn(),
  changePassword: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should call authService.login with request user', () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      const mockResult = { access_token: 'token', user: mockUser };
      mockAuthService.login.mockReturnValue(mockResult);

      const result = controller.login({ user: mockUser } as any);

      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResult);
    });
  });

  describe('signup', () => {
    it('should call authService.signup with body', async () => {
      const dto = {
        name: 'Test New User Account',
        email: 'new@test.com',
        password: 'TestPass123!',
      };
      mockAuthService.signup.mockResolvedValue({ message: 'ok' });

      const result = await controller.signup(dto);

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'ok' });
    });
  });

  describe('changePassword', () => {
    it('should call authService.changePassword with user id and body', async () => {
      const user = { id: '1' };
      const body = { current_password: 'OldPass123!', new_password: 'NewPass123!' };
      mockAuthService.changePassword.mockResolvedValue({ message: 'ok' });

      const result = await controller.changePassword(
        { user } as any,
        body,
      );

      expect(mockAuthService.changePassword).toHaveBeenCalledWith(
        '1',
        'OldPass123!',
        'NewPass123!',
      );
      expect(result).toEqual({ message: 'ok' });
    });
  });
});