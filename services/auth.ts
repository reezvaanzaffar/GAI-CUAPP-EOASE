export class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call
    if (
      credentials.email === 'test@example.com' &&
      credentials.password === 'password123' // replace with your test password
    ) {
      return {
        id: '1',
        email: credentials.email,
        name: 'Test User',
        role: 'ADMIN', // <-- Set correct role
      } as User;
    }
    // Default to user
    return {
      id: '2',
      email: credentials.email,
      name: 'Regular User',
      role: 'user',
    } as User;
  }

  async register(data: RegisterCredentials): Promise<User> {
    // Simulate API call
    return {
      id: '1',
      email: data.email,
      name: data.name,
      role: 'user'
    } as User;
  }

  async logout(): Promise<void> {
    // Simulate logout
    return;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    // Simulate API call
    return {
      id: '1',
      email: 'user@example.com',
      name: updates.name || 'Test User',
      role: 'user',
      ...updates
    } as User;
  }

  async resetPassword(email: string): Promise<void> {
    // Simulate API call
    return;
  }

  async verifyEmail(token: string): Promise<User> {
    // Simulate API call
    return {
      id: '1',
      email: 'user@example.com',
      name: 'Test User',
      role: 'user',
      emailVerified: new Date()
    } as User;
  }
}

export const authService = AuthService; 