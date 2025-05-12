import { signUp } from '../services/firebase/auth';

export const createTestUsers = async () => {
  try {
    // Create test admin user
    await signUp('admin@test.com', 'admin123', 'Admin Test', 'admin');
    console.log('Test admin user created successfully');

    // Create test client user
    await signUp('client@test.com', 'client123', 'Client Test', 'client');
    console.log('Test client user created successfully');

    return true;
  } catch (error) {
    console.error('Error creating test users:', error);
    return false;
  }
};