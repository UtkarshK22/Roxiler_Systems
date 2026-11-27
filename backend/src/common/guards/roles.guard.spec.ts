import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../common/entities/user.entity';

const mockReflector = {
  getAllAndOverride: jest.fn(),
};

const mockExecutionContext = {
  switchToHttp: jest.fn(() => ({
    getRequest: jest.fn(() => ({ user: { role: UserRole.SYSTEM_ADMIN } })),
  })),
  getHandler: jest.fn(),
  getClass: jest.fn(),
};

describe('RolesGuard', () => {
  let guard: RolesGuard;

  beforeEach(() => {
    guard = new RolesGuard(mockReflector as any);
    jest.clearAllMocks();
  });

  it('should allow access when no roles are required', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    expect(guard.canActivate(mockExecutionContext as any)).toBe(true);
  });

  it('should allow access when user has required role', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue([
      UserRole.SYSTEM_ADMIN,
    ]);
    expect(guard.canActivate(mockExecutionContext as any)).toBe(true);
  });

  it('should deny access when user does not have required role', () => {
    (mockReflector.getAllAndOverride as jest.Mock).mockReturnValue([
      UserRole.SYSTEM_ADMIN,
    ]);
    const ctx = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({ user: { role: UserRole.NORMAL_USER } })),
      })),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    };
    expect(() => guard.canActivate(ctx as any)).toThrow();
  });
});