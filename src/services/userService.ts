import { User } from '@/types/user';

// Mock database service - in a real application, this would connect to your actual database
class UserService {
  // Check if user exists by email
  async userExists(email: string): Promise<boolean> {
    // In a real app, this would query your database
    // For now, we'll simulate checking a mock database
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    return mockUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
  }

  // Create a new user
  async createUser(userData: {
    name: string;
    email: string;
    password_hash?: string;
    is_google_user?: boolean;
  }): Promise<User> {
    // In a real app, this would insert into your database
    // For now, we'll use localStorage as mock database
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');

    // Check if user already exists
    const existingUser = mockUsers.find((user: any) => user.email === userData.email);
    if (existingUser) {
      return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      };
    }

    const newUser = {
      id: mockUsers.length > 0 ? Math.max(...mockUsers.map((u: any) => u.id)) + 1 : 1, // Better ID generation
      name: userData.name,
      email: userData.email,
      password_hash: userData.password_hash || null,
      is_google_user: userData.is_google_user || false,
      remember_token: null,
      email_verified: true, // Google users are automatically verified
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockUsers.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  // Find user by email
  async findByEmail(email: string): Promise<any | null> {
    // In a real app, this would query your database
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = mockUsers.find((user: any) => user.email === email);

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        is_google_user: user.is_google_user,
        remember_token: user.remember_token,
        email_verified: user.email_verified,
      };
    }

    return null;
  }

  // Update remember token for a user
  async updateRememberToken(userId: number, rememberToken: string | null): Promise<void> {
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const userIndex = mockUsers.findIndex((user: any) => user.id === userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex].remember_token = rememberToken;
      mockUsers[userIndex].updated_at = new Date().toISOString();
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }
  }

  // Find user by remember token
  async findByRememberToken(rememberToken: string): Promise<User | null> {
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = mockUsers.find((user: any) => user.remember_token === rememberToken);
    
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    }
    
    return null;
  }

  // Update user password (for regular users, not Google users)
  async updatePassword(userId: number, newPasswordHash: string): Promise<void> {
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const userIndex = mockUsers.findIndex((user: any) => user.id === userId);
    
    if (userIndex !== -1) {
      mockUsers[userIndex].password_hash = newPasswordHash;
      mockUsers[userIndex].updated_at = new Date().toISOString();
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }
  }
}

export const userService = new UserService();