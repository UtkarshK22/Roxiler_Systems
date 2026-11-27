import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, UserRole } from '../types';
import { authAPI } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearStoredAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/** Reads the saved user without ever throwing on a corrupted value. */
function readStoredUser(): User | null {
  const raw = localStorage.getItem('user');
  if (!raw || raw === 'undefined' || raw === 'null') {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = readStoredUser();

    if (storedToken && storedToken !== 'undefined' && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      // Remove any half-saved or corrupted values
      clearStoredAuth();
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    if (!newToken || !newUser) {
      // Never store "undefined"; the caller read the login response wrongly
      console.error('login() called without a token or user', { newToken, newUser });
      return;
    }
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const changePassword = async (data: {
    current_password: string;
    new_password: string;
  }) => {
    await authAPI.changePassword(data);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRole = () => {
  const { user } = useAuth();
  return user?.role;
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'SYSTEM_ADMIN';
};

export const useIsOwner = () => {
  const { user } = useAuth();
  return user?.role === 'STORE_OWNER';
};

export const useIsNormalUser = () => {
  const { user } = useAuth();
  return user?.role === 'NORMAL_USER';
};